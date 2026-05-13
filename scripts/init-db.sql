-- Initialize OpenCampusOS database schemas and base tables

-- Create schemas
CREATE SCHEMA IF NOT EXISTS auth;
CREATE SCHEMA IF NOT EXISTS sis;
CREATE SCHEMA IF NOT EXISTS admissions;
CREATE SCHEMA IF NOT EXISTS finance;
CREATE SCHEMA IF NOT EXISTS hr;
CREATE SCHEMA IF NOT EXISTS workflow;
CREATE SCHEMA IF NOT EXISTS analytics;

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For text search
CREATE EXTENSION IF NOT EXISTS "hstore"; -- For key-value pairs

-- Create event trigger function for publishing to Kafka
CREATE OR REPLACE FUNCTION notify_event()
RETURNS TRIGGER AS $$
DECLARE
  record RECORD;
  payload TEXT;
BEGIN
  IF (TG_OP = 'DELETE') THEN
    record = OLD;
  ELSE
    record = NEW;
  END IF;

  payload = json_build_object(
    'operation', TG_OP,
    'schema', TG_TABLE_SCHEMA,
    'table', TG_TABLE_NAME,
    'record', row_to_json(record)
  )::text;

  PERFORM pg_notify('db_events', payload);
  RETURN record;
END;
$$ LANGUAGE plpgsql;

-- Sample seed data for testing

-- Create a test institution
INSERT INTO auth.institutions (name, code, type, country, timezone)
VALUES (
  'Test University',
  'TEST-U',
  'university',
  'US',
  'America/Chicago'
);

-- Get the institution ID for referencing
DO $$
DECLARE
  test_institution_id UUID;
BEGIN
  SELECT id INTO test_institution_id FROM auth.institutions WHERE code = 'TEST-U';

  -- Create test admin user
  INSERT INTO auth.users (
    tenant_id,
    email,
    username,
    first_name,
    last_name,
    role,
    status
  ) VALUES (
    test_institution_id,
    'admin@testuniversity.edu',
    'admin',
    'System',
    'Administrator',
    'admin',
    'active'
  );

  -- Create test student user
  INSERT INTO auth.users (
    tenant_id,
    email,
    username,
    first_name,
    last_name,
    role,
    status
  ) VALUES (
    test_institution_id,
    'student@testuniversity.edu',
    'student001',
    'John',
    'Doe',
    'student',
    'active'
  );

  -- Create test faculty user
  INSERT INTO auth.users (
    tenant_id,
    email,
    username,
    first_name,
    last_name,
    role,
    status
  ) VALUES (
    test_institution_id,
    'faculty@testuniversity.edu',
    'faculty001',
    'Jane',
    'Smith',
    'faculty',
    'active'
  );

  -- Create roles
  INSERT INTO auth.roles (
    tenant_id,
    name,
    description,
    is_system,
    permissions
  ) VALUES (
    test_institution_id,
    'Administrator',
    'Full system access',
    true,
    '{"all": true}'::jsonb
  ), (
    test_institution_id,
    'Faculty',
    'Faculty can manage courses and grades',
    true,
    '{"courses": ["read", "write"], "grades": ["read", "write"]}'::jsonb
  ), (
    test_institution_id,
    'Student',
    'Students can view their records',
    true,
    '{"enrollment": ["read"], "grades": ["read"], "transcript": ["read"]}'::jsonb
  );

  -- Create a test program
  INSERT INTO sis.programs (
    tenant_id,
    code,
    name,
    description,
    degree_level,
    total_credits_required,
    expected_duration_months
  ) VALUES (
    test_institution_id,
    'CS-BS',
    'Bachelor of Science in Computer Science',
    'A comprehensive program in computer science',
    'bachelor',
    120,
    48
  );

  -- Create test courses
  INSERT INTO sis.courses (
    tenant_id,
    code,
    title,
    description,
    credits,
    level,
    max_enrollment
  ) VALUES (
    test_institution_id,
    'CS101',
    'Introduction to Computer Science',
    'Fundamentals of computer science and programming',
    3,
    'undergraduate',
    50
  ), (
    test_institution_id,
    'CS201',
    'Data Structures',
    'Learn fundamental data structures and algorithms',
    4,
    'undergraduate',
    40
  );

  -- Create academic term
  INSERT INTO sis.academic_terms (
    tenant_id,
    code,
    name,
    start_date,
    end_date,
    status,
    registration_start_date,
    registration_end_date
  ) VALUES (
    test_institution_id,
    'SP2026',
    'Spring 2026',
    '2026-01-15',
    '2026-05-15',
    'active',
    '2025-12-01',
    '2026-01-10'
  );

  -- Create test student
  INSERT INTO sis.students (
    tenant_id,
    user_id,
    student_id,
    first_name,
    last_name,
    email,
    phone,
    status,
    program_id,
    admission_date
  ) VALUES (
    test_institution_id,
    (SELECT id FROM auth.users WHERE email = 'student@testuniversity.edu'),
    'STU-001',
    'John',
    'Doe',
    'student@testuniversity.edu',
    '555-0001',
    'active',
    (SELECT id FROM sis.programs WHERE code = 'CS-BS'),
    '2025-08-15'
  );

  -- Create test faculty
  INSERT INTO hr.faculty (
    tenant_id,
    user_id,
    employee_id,
    title,
    hire_date
  ) VALUES (
    test_institution_id,
    (SELECT id FROM auth.users WHERE email = 'faculty@testuniversity.edu'),
    'FAC-001',
    'Professor',
    '2020-01-15'
  );

  -- Create test applicant
  INSERT INTO admissions.applicants (
    tenant_id,
    first_name,
    last_name,
    email,
    high_school,
    high_school_gpa,
    status,
    program_of_interest_id
  ) VALUES (
    test_institution_id,
    'Alice',
    'Johnson',
    'alice.johnson@example.com',
    'State High School',
    3.8,
    'new',
    (SELECT id FROM sis.programs WHERE code = 'CS-BS')
  );

END $$;

-- Create indexes for common queries
CREATE INDEX CONCURRENTLY idx_users_active ON auth.users(tenant_id) WHERE deleted_at IS NULL;
CREATE INDEX CONCURRENTLY idx_students_tenant ON sis.students(tenant_id) WHERE deleted_at IS NULL;
CREATE INDEX CONCURRENTLY idx_enrollments_student ON sis.enrollments(tenant_id, student_id) WHERE deleted_at IS NULL;
CREATE INDEX CONCURRENTLY idx_applicants_status ON admissions.applicants(tenant_id, status);
CREATE INDEX CONCURRENTLY idx_charges_due ON finance.charges(tenant_id, due_date, status);

-- Grant permissions
GRANT USAGE ON SCHEMA auth, sis, admissions, finance, hr, workflow, analytics TO opencampus;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA auth, sis, admissions, finance, hr, workflow, analytics TO opencampus;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA auth, sis, admissions, finance, hr, workflow, analytics TO opencampus;

COMMIT;
