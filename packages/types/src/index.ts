// ============================================================================
// COMMON TYPES
// ============================================================================

export interface BaseEntity {
  id: string;
  tenantId: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sort?: string;
  search?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    hasMore: boolean;
  };
}

export interface ApiResponse<T> {
  status: 'success' | 'error';
  data?: T;
  error?: ApiError;
  meta: {
    timestamp: string;
    requestId: string;
  };
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, string>[];
}

export interface RequestContext {
  tenantId: string;
  userId: string;
  userEmail: string;
  userRole: string;
  requestId: string;
  timestamp: Date;
  ip?: string;
  userAgent?: string;
}

// ============================================================================
// AUTH TYPES
// ============================================================================

export enum UserRole {
  ADMIN = 'admin',
  FACULTY = 'faculty',
  STUDENT = 'student',
  STAFF = 'staff',
  PARENT = 'parent'
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended'
}

export interface User extends BaseEntity {
  email: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatarUrl?: string;
  role: UserRole;
  status: UserStatus;
  lastLoginAt?: Date;
  mfaEnabled: boolean;
  keycloakId?: string;
}

export interface Institution extends BaseEntity {
  name: string;
  code: string;
  type: 'university' | 'college' | 'online_school';
  country?: string;
  timezone?: string;
  logoUrl?: string;
  website?: string;
  legalName?: string;
  ein?: string;
}

// ============================================================================
// SIS TYPES
// ============================================================================

export enum StudentStatus {
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  GRADUATED = 'graduated',
  WITHDRAWN = 'withdrawn'
}

export interface Student extends BaseEntity {
  userId: string;
  studentId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth?: Date;
  status: StudentStatus;
  admissionDate?: Date;
  graduationDate?: Date;
  programId?: string;
  classYear?: 'freshman' | 'sophomore' | 'junior' | 'senior';
  gpa?: number;
  cumulativeCredits: number;
}

export interface Program extends BaseEntity {
  code: string;
  name: string;
  description?: string;
  degreeLevel?: 'associate' | 'bachelor' | 'master' | 'phd';
  totalCreditsRequired?: number;
  expectedDurationMonths?: number;
  status: 'active' | 'inactive' | 'archived';
}

export interface Course extends BaseEntity {
  code: string;
  title: string;
  description?: string;
  credits?: number;
  level?: 'undergraduate' | 'graduate';
  maxEnrollment?: number;
  gradingScale?: 'letter' | 'numeric' | 'pass_fail';
}

export interface CourseSection extends BaseEntity {
  courseId: string;
  sectionNumber: string;
  termId?: string;
  instructorId: string;
  location?: string;
  meetingDays?: string;
  startTime?: string;
  endTime?: string;
  enrolledCount: number;
  maxEnrollment?: number;
  status: 'active' | 'canceled' | 'completed';
}

export enum EnrollmentStatus {
  ENROLLED = 'enrolled',
  DROPPED = 'dropped',
  COMPLETED = 'completed',
  AUDIT = 'audit'
}

export interface Enrollment extends BaseEntity {
  studentId: string;
  sectionId: string;
  enrollmentDate: Date;
  status: EnrollmentStatus;
  grade?: string;
  gradePoints?: number;
  gradeSubmittedDate?: Date;
  attendancePercentage?: number;
}

export interface AcademicTerm extends BaseEntity {
  code: string;
  name: string;
  startDate: Date;
  endDate: Date;
  status: 'planning' | 'active' | 'closed';
  registrationStartDate?: Date;
  registrationEndDate?: Date;
}

export interface Transcript extends BaseEntity {
  studentId: string;
  generatedDate: Date;
  gpa?: number;
  totalCredits?: number;
  honors?: string;
  enrolledCourses?: Record<string, unknown>[];
  notes?: string;
}

// ============================================================================
// ADMISSIONS TYPES
// ============================================================================

export enum ApplicantStatus {
  NEW = 'new',
  REVIEWING = 'reviewing',
  ADMITTED = 'admitted',
  WAITLIST = 'waitlist',
  REJECTED = 'rejected'
}

export interface Applicant extends BaseEntity {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth?: Date;
  highSchool?: string;
  highSchoolGpa?: number;
  status: ApplicantStatus;
  programOfInterestId?: string;
  studentId?: string;
}

export enum ApplicationStatus {
  SUBMITTED = 'submitted',
  REVIEWING = 'reviewing',
  DECISION_MADE = 'decision_made',
  WITHDRAWN = 'withdrawn'
}

export interface Application extends BaseEntity {
  applicantId: string;
  programId: string;
  applicationType?: 'freshman' | 'transfer' | 'graduate';
  status: ApplicationStatus;
  submittedDate: Date;
  decisionDate?: Date;
  decision?: 'admitted' | 'rejected' | 'waitlist';
  aiScore?: number;
  documents?: Record<string, string>;
}

export interface Recommendation extends BaseEntity {
  applicationId: string;
  applicantId: string;
  recommenderName: string;
  recommenderEmail?: string;
  relationship?: string;
  submittedDate?: Date;
  score?: number;
}

// ============================================================================
// FINANCE TYPES
// ============================================================================

export interface StudentAccount extends BaseEntity {
  studentId: string;
  accountNumber: string;
  balance: number;
  status: 'active' | 'suspended' | 'closed';
}

export interface Charge extends BaseEntity {
  studentAccountId: string;
  chargeType: 'tuition' | 'fees' | 'housing' | 'other';
  termId?: string;
  amount: number;
  chargeDate: Date;
  dueDate: Date;
  description?: string;
  status: 'open' | 'paid' | 'outstanding';
}

export interface Payment extends BaseEntity {
  studentAccountId: string;
  amount: number;
  paymentDate: Date;
  paymentMethod?: 'credit_card' | 'ach' | 'check' | 'cash';
  transactionId?: string;
  status: 'pending' | 'completed' | 'failed';
  notes?: string;
}

export interface FinancialAidAward extends BaseEntity {
  studentId: string;
  academicYear: string;
  aidType: 'grant' | 'scholarship' | 'loan' | 'work_study';
  amount: number;
  termId?: string;
  status: 'awarded' | 'accepted' | 'declined' | 'pending';
}

// ============================================================================
// HR TYPES
// ============================================================================

export interface Faculty extends BaseEntity {
  userId: string;
  employeeId: string;
  title?: string;
  departmentId?: string;
  officeLocation?: string;
  phoneExtension?: string;
  specializations: string[];
  hireDate: Date;
  status: 'active' | 'leave' | 'retired' | 'inactive';
}

export interface Employee extends BaseEntity {
  userId: string;
  employeeId: string;
  jobTitle: string;
  departmentId?: string;
  hireDate: Date;
  employmentType: 'full_time' | 'part_time' | 'contract';
  salary?: number;
  status: 'active' | 'leave' | 'retired' | 'inactive';
}

// ============================================================================
// WORKFLOW TYPES
// ============================================================================

export interface Workflow extends BaseEntity {
  name: string;
  description?: string;
  triggerType: 'event' | 'schedule' | 'manual';
  triggerConfig?: Record<string, unknown>;
  steps: WorkflowStep[];
  enabled: boolean;
  createdById: string;
}

export interface WorkflowStep {
  id: string;
  type: 'action' | 'condition' | 'approval' | 'notification';
  name: string;
  config: Record<string, unknown>;
  nextStepId?: string;
}

export interface WorkflowExecution extends BaseEntity {
  workflowId: string;
  entityType?: string;
  entityId?: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  startedAt: Date;
  completedAt?: Date;
  output?: Record<string, unknown>;
  errorMessage?: string;
}

// ============================================================================
// EVENT TYPES
// ============================================================================

export interface DomainEvent {
  id: string;
  type: string;
  aggregateId: string;
  aggregateType: string;
  tenantId: string;
  timestamp: Date;
  version: number;
  data: Record<string, unknown>;
  metadata: {
    userId?: string;
    requestId: string;
    ip?: string;
  };
}

export const StudentEvents = {
  CREATED: 'student.created',
  ENROLLED: 'student.enrolled',
  GRADUATED: 'student.graduated',
  WITHDRAWN: 'student.withdrawn'
} as const;

export const GradeEvents = {
  SUBMITTED: 'grade.submitted',
  UPDATED: 'grade.updated',
  REMOVED: 'grade.removed'
} as const;

export const ApplicationEvents = {
  SUBMITTED: 'application.submitted',
  REVIEWED: 'application.reviewed',
  DECIDED: 'application.decided'
} as const;

export const AdmissionEvents = {
  APPLICANT_CREATED: 'applicant.created',
  APPLICANT_STATUS_CHANGED: 'applicant.status_changed'
} as const;

// ============================================================================
// DTO TYPES
// ============================================================================

export interface CreateStudentDto {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth?: Date;
  programId?: string;
  admissionDate?: Date;
}

export interface CreateCourseDto {
  code: string;
  title: string;
  description?: string;
  credits?: number;
  level?: 'undergraduate' | 'graduate';
  maxEnrollment?: number;
}

export interface CreateApplicationDto {
  applicantId: string;
  programId: string;
  applicationType?: 'freshman' | 'transfer' | 'graduate';
  documents?: Record<string, string>;
}

export interface EnrollmentInput {
  studentId: string;
  sectionId: string;
  enrollmentDate: Date;
}

// ============================================================================
// FILTER & QUERY TYPES
// ============================================================================

export interface StudentFilter {
  status?: StudentStatus;
  programId?: string;
  gpa?: { min?: number; max?: number };
  admissionDateAfter?: Date;
  admissionDateBefore?: Date;
}

export interface ApplicationFilter {
  status?: ApplicationStatus;
  decision?: 'admitted' | 'rejected' | 'waitlist';
  programId?: string;
  submittedAfter?: Date;
  submittedBefore?: Date;
}

// ============================================================================
// CONSTANTS
// ============================================================================

export const HTTP_STATUS_CODES = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  RATE_LIMITED: 429,
  INTERNAL_ERROR: 500,
  SERVICE_UNAVAILABLE: 503
} as const;

export const ERROR_CODES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  CONFLICT: 'CONFLICT',
  UNPROCESSABLE_ENTITY: 'UNPROCESSABLE_ENTITY',
  RATE_LIMITED: 'RATE_LIMITED',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE'
} as const;
