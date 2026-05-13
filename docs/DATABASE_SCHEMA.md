# OpenCampusOS Database Schema Design

## Overview

PostgreSQL is the primary transactional database using a **multi-schema architecture**, where each domain (SIS, Admissions, Finance, etc.) has its own schema while maintaining referential integrity through carefully designed relationships.

All tables include:
- `id` (UUID primary key)
- `tenant_id` (UUID for multi-tenancy)
- `created_at` (timestamp with timezone)
- `updated_at` (timestamp with timezone)
- `deleted_at` (soft delete, NULL = active)
- `created_by_id` (user who created)
- `updated_by_id` (user who updated)

---

## Schema: auth

### Table: institutions
```sql
CREATE TABLE auth.institutions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  code VARCHAR(20) UNIQUE NOT NULL,
  type VARCHAR(50) NOT NULL, -- 'university', 'college', 'online_school'
  country VARCHAR(2),
  timezone VARCHAR(50),
  logo_url TEXT,
  website TEXT,
  legal_name VARCHAR(255),
  ein VARCHAR(20), -- Federal employer ID
  accreditation_status VARCHAR(50),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  deleted_at TIMESTAMPTZ
);
```

### Table: users
```sql
CREATE TABLE auth.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES auth.institutions(id),
  email VARCHAR(255) NOT NULL,
  username VARCHAR(100),
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  phone VARCHAR(20),
  avatar_url TEXT,
  date_of_birth DATE,
  role VARCHAR(50), -- 'admin', 'faculty', 'student', 'staff'
  status VARCHAR(50) DEFAULT 'active', -- 'active', 'inactive', 'suspended'
  last_login_at TIMESTAMPTZ,
  mfa_enabled BOOLEAN DEFAULT false,
  is_internal BOOLEAN DEFAULT true,
  external_id VARCHAR(100), -- For LDAP/SSO sync
  keycloak_id UUID, -- Reference to Keycloak user
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  deleted_at TIMESTAMPTZ,
  UNIQUE(tenant_id, email),
  INDEX (tenant_id),
  INDEX (email)
);
```

### Table: roles
```sql
CREATE TABLE auth.roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES auth.institutions(id),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  permissions JSONB NOT NULL DEFAULT '{}',
  is_system BOOLEAN DEFAULT false, -- System roles are immutable
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(tenant_id, name)
);
```

### Table: user_roles
```sql
CREATE TABLE auth.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role_id UUID NOT NULL REFERENCES auth.roles(id) ON DELETE CASCADE,
  assigned_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, role_id)
);
```

### Table: audit_log
```sql
CREATE TABLE auth.audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES auth.institutions(id),
  entity_type VARCHAR(50) NOT NULL, -- 'user', 'student', 'course', etc.
  entity_id UUID NOT NULL,
  action VARCHAR(50) NOT NULL, -- 'create', 'update', 'delete'
  old_values JSONB,
  new_values JSONB,
  user_id UUID REFERENCES auth.users(id),
  ip_address INET,
  user_agent TEXT,
  timestamp TIMESTAMPTZ DEFAULT now(),
  INDEX (tenant_id),
  INDEX (entity_type, entity_id),
  INDEX (timestamp)
);
```

---

## Schema: sis

### Table: students
```sql
CREATE TABLE sis.students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES auth.institutions(id),
  user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id),
  student_id VARCHAR(20) NOT NULL, -- Institutional student ID
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  date_of_birth DATE,
  ssn_encrypted BYTEA, -- Encrypted
  gender VARCHAR(20),
  nationality VARCHAR(2),
  address_line1 VARCHAR(255),
  address_line2 VARCHAR(255),
  city VARCHAR(100),
  state_province VARCHAR(100),
  postal_code VARCHAR(20),
  country VARCHAR(2),
  status VARCHAR(50) DEFAULT 'active', -- 'active', 'suspended', 'graduated', 'withdrawn'
  admission_date DATE,
  graduation_date DATE,
  program_id UUID, -- Reference to program
  class_year VARCHAR(20), -- 'freshman', 'sophomore', 'junior', 'senior'
  gpa NUMERIC(4,3),
  cumulative_credits NUMERIC(6,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  deleted_at TIMESTAMPTZ,
  UNIQUE(tenant_id, student_id),
  INDEX (tenant_id),
  INDEX (email)
);
```

### Table: programs
```sql
CREATE TABLE sis.programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES auth.institutions(id),
  code VARCHAR(50) NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  degree_level VARCHAR(50), -- 'associate', 'bachelor', 'master', 'phd'
  total_credits_required NUMERIC(6,2),
  expected_duration_months INT,
  school_id UUID, -- Reference to school/college
  department_id UUID,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(tenant_id, code)
);
```

### Table: courses
```sql
CREATE TABLE sis.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES auth.institutions(id),
  code VARCHAR(20) NOT NULL, -- e.g., 'CS101'
  title VARCHAR(255) NOT NULL,
  description TEXT,
  credits NUMERIC(3,1),
  level VARCHAR(20), -- 'undergraduate', 'graduate'
  department_id UUID,
  prerequisites TEXT, -- JSON array of course IDs
  corequisites TEXT,
  max_enrollment INT,
  grading_scale VARCHAR(50), -- 'letter', 'numeric', 'pass_fail'
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(tenant_id, code)
);
```

### Table: enrollments
```sql
CREATE TABLE sis.enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES auth.institutions(id),
  student_id UUID NOT NULL REFERENCES sis.students(id),
  section_id UUID NOT NULL, -- Reference to course_section
  enrollment_date DATE NOT NULL,
  status VARCHAR(50) DEFAULT 'enrolled', -- 'enrolled', 'dropped', 'completed', 'audit'
  grade VARCHAR(2), -- 'A', 'B', 'C', etc.
  grade_points NUMERIC(4,3),
  grade_submitted_date TIMESTAMPTZ,
  attendance_percentage NUMERIC(5,2),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(tenant_id, student_id, section_id),
  INDEX (tenant_id, student_id),
  INDEX (section_id)
);
```

### Table: course_sections
```sql
CREATE TABLE sis.course_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES auth.institutions(id),
  course_id UUID NOT NULL REFERENCES sis.courses(id),
  section_number VARCHAR(10) NOT NULL,
  term_id UUID, -- Reference to academic_term
  instructor_id UUID NOT NULL REFERENCES auth.users(id),
  location VARCHAR(255),
  meeting_days VARCHAR(10), -- 'MWF', 'TR', etc.
  start_time TIME,
  end_time TIME,
  enrolled_count INT DEFAULT 0,
  max_enrollment INT,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(tenant_id, course_id, section_number)
);
```

### Table: academic_terms
```sql
CREATE TABLE sis.academic_terms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES auth.institutions(id),
  code VARCHAR(20) NOT NULL, -- 'SP2026', 'FA2026'
  name VARCHAR(100) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status VARCHAR(50) DEFAULT 'planning', -- 'planning', 'active', 'closed'
  registration_start_date DATE,
  registration_end_date DATE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(tenant_id, code)
);
```

### Table: transcripts
```sql
CREATE TABLE sis.transcripts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES auth.institutions(id),
  student_id UUID NOT NULL REFERENCES sis.students(id),
  generated_date TIMESTAMPTZ DEFAULT now(),
  gpa NUMERIC(4,3),
  total_credits NUMERIC(6,2),
  honors TEXT, -- 'cum_laude', 'magna_cum_laude', etc.
  enrolled_courses JSONB, -- Array of enrollment records
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

---

## Schema: admissions

### Table: applicants
```sql
CREATE TABLE admissions.applicants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES auth.institutions(id),
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  date_of_birth DATE,
  high_school VARCHAR(255),
  high_school_gpa NUMERIC(4,3),
  test_scores JSONB, -- SAT, ACT, GRE, etc.
  status VARCHAR(50) DEFAULT 'new', -- 'new', 'reviewing', 'admitted', 'waitlist', 'rejected'
  program_of_interest_id UUID,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  deleted_at TIMESTAMPTZ,
  INDEX (tenant_id, email)
);
```

### Table: applications
```sql
CREATE TABLE admissions.applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES auth.institutions(id),
  applicant_id UUID NOT NULL REFERENCES admissions.applicants(id),
  program_id UUID NOT NULL REFERENCES sis.programs(id),
  application_type VARCHAR(50), -- 'freshman', 'transfer', 'graduate'
  status VARCHAR(50) DEFAULT 'submitted',
  submitted_date TIMESTAMPTZ NOT NULL,
  decision_date TIMESTAMPTZ,
  decision VARCHAR(50), -- 'admitted', 'rejected', 'waitlist'
  ai_score NUMERIC(5,2), -- AI application scoring
  documents JSONB, -- { 'essay': url, 'transcript': url, ... }
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(tenant_id, applicant_id, program_id)
);
```

### Table: recommendations
```sql
CREATE TABLE admissions.recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES auth.institutions(id),
  application_id UUID NOT NULL REFERENCES admissions.applications(id),
  recommender_name VARCHAR(255) NOT NULL,
  recommender_email VARCHAR(255),
  relationship VARCHAR(100),
  submitted_date TIMESTAMPTZ,
  text BYTEA, -- Encrypted recommendation letter
  score NUMERIC(5,2),
  created_at TIMESTAMPTZ DEFAULT now()
);
```

---

## Schema: finance

### Table: student_accounts
```sql
CREATE TABLE finance.student_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES auth.institutions(id),
  student_id UUID NOT NULL REFERENCES sis.students(id),
  account_number VARCHAR(50) UNIQUE NOT NULL,
  balance NUMERIC(12,2) DEFAULT 0,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(tenant_id, student_id)
);
```

### Table: charges
```sql
CREATE TABLE finance.charges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES auth.institutions(id),
  student_account_id UUID NOT NULL REFERENCES finance.student_accounts(id),
  charge_type VARCHAR(50) NOT NULL, -- 'tuition', 'fees', 'housing', 'other'
  term_id UUID REFERENCES sis.academic_terms(id),
  amount NUMERIC(12,2) NOT NULL,
  charge_date DATE NOT NULL,
  due_date DATE NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'open', -- 'open', 'paid', 'outstanding'
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### Table: payments
```sql
CREATE TABLE finance.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES auth.institutions(id),
  student_account_id UUID NOT NULL REFERENCES finance.student_accounts(id),
  amount NUMERIC(12,2) NOT NULL,
  payment_date DATE NOT NULL,
  payment_method VARCHAR(50), -- 'credit_card', 'ach', 'check', 'cash'
  transaction_id VARCHAR(100) UNIQUE,
  status VARCHAR(50) DEFAULT 'completed', -- 'pending', 'completed', 'failed'
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### Table: financial_aid_awards
```sql
CREATE TABLE finance.financial_aid_awards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES auth.institutions(id),
  student_id UUID NOT NULL REFERENCES sis.students(id),
  academic_year VARCHAR(10),
  aid_type VARCHAR(50), -- 'grant', 'scholarship', 'loan', 'work_study'
  amount NUMERIC(12,2) NOT NULL,
  term_id UUID REFERENCES sis.academic_terms(id),
  status VARCHAR(50) DEFAULT 'awarded',
  created_at TIMESTAMPTZ DEFAULT now()
);
```

---

## Schema: hr

### Table: faculty
```sql
CREATE TABLE hr.faculty (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES auth.institutions(id),
  user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id),
  employee_id VARCHAR(20) UNIQUE NOT NULL,
  title VARCHAR(100), -- 'Professor', 'Associate Professor', etc.
  department_id UUID,
  office_location VARCHAR(255),
  phone_extension VARCHAR(10),
  specializations TEXT[], -- Array of expertise areas
  hire_date DATE NOT NULL,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(tenant_id, employee_id)
);
```

### Table: employees
```sql
CREATE TABLE hr.employees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES auth.institutions(id),
  user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id),
  employee_id VARCHAR(20) UNIQUE NOT NULL,
  job_title VARCHAR(100) NOT NULL,
  department_id UUID,
  hire_date DATE NOT NULL,
  employment_type VARCHAR(50), -- 'full_time', 'part_time', 'contract'
  salary NUMERIC(12,2),
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(tenant_id, employee_id)
);
```

---

## Schema: workflow

### Table: workflows
```sql
CREATE TABLE workflow.workflows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES auth.institutions(id),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  trigger_type VARCHAR(50) NOT NULL, -- 'event', 'schedule', 'manual'
  trigger_config JSONB,
  steps JSONB NOT NULL, -- Array of workflow steps
  enabled BOOLEAN DEFAULT true,
  created_by_id UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

### Table: workflow_executions
```sql
CREATE TABLE workflow.workflow_executions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES auth.institutions(id),
  workflow_id UUID NOT NULL REFERENCES workflow.workflows(id),
  entity_type VARCHAR(50),
  entity_id UUID,
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'running', 'completed', 'failed'
  started_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ,
  output JSONB,
  error_message TEXT,
  INDEX (tenant_id, workflow_id),
  INDEX (status)
);
```

---

## Indexes and Performance

All tables include strategic indexes:

```sql
-- Multi-column indexes for common queries
CREATE INDEX idx_students_tenant_program ON sis.students(tenant_id, program_id);
CREATE INDEX idx_enrollments_student_term ON sis.enrollments(tenant_id, student_id, (sis.enrollments.created_at));
CREATE INDEX idx_applications_status ON admissions.applications(tenant_id, status, submitted_date);
CREATE INDEX idx_charges_due_date ON finance.charges(tenant_id, due_date, status);

-- Partial indexes for active records
CREATE INDEX idx_users_active ON auth.users(tenant_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_enrollments_active ON sis.enrollments(tenant_id, student_id) WHERE deleted_at IS NULL;
```

---

## Multi-Tenancy Strategy

Every table includes `tenant_id` to achieve complete data isolation:

```sql
-- Row-Level Security (RLS) policies
ALTER TABLE sis.students ENABLE ROW LEVEL SECURITY;

CREATE POLICY students_tenant_isolation ON sis.students
  USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

-- Set tenant context per request
SET app.current_tenant_id = '123e4567-e89b-12d3-a456-426614174000';
```

---

## Triggers for Event Publishing

```sql
-- Publish events to Kafka when state changes
CREATE OR REPLACE FUNCTION publish_student_event()
RETURNS TRIGGER AS $$
BEGIN
  -- Trigger Kafka publish via notification
  PERFORM pg_notify('events', json_build_object(
    'type', TG_ARGV[0],
    'aggregate_id', NEW.id,
    'tenant_id', NEW.tenant_id,
    'data', row_to_json(NEW)
  )::text);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_student_enrolled
AFTER INSERT ON sis.enrollments
FOR EACH ROW
EXECUTE FUNCTION publish_student_event('enrollment.created');
```

---

## Next Steps

1. Generate Prisma schema from these definitions
2. Create database migrations
3. Implement RLS policies
4. Set up replication for analytics
