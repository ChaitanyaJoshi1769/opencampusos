# OpenCampusOS Services Guide

Complete documentation of all microservices in the OpenCampusOS platform.

## Overview

OpenCampusOS is built on a microservices architecture with specialized services for different functional areas of higher education administration.

## 🎓 Core Services

### 1. SIS Service (Student Information System)
**Port:** 3002 | **Status:** ✅ Complete

Manages the complete student lifecycle and academic information.

**Modules:**
- **Students** - Student records, enrollment status, GPA, academic standing
- **Courses** - Course definitions, sections, instructors, prerequisites
- **Enrollments** - Student course enrollments, grades, credits
- **Transcripts** - Academic records, degree audits, graduation tracking
- **AcademicTerms** - Term definitions, registration windows, academic calendars

**Key Endpoints:**
```
POST   /v1/students                    # Create student
GET    /v1/students                    # List students
GET    /v1/students/:id                # Get student
PATCH  /v1/students/:id                # Update student
PATCH  /v1/students/:id/gpa            # Update GPA
GET    /v1/students/search             # Full-text search
GET    /v1/students/at-risk            # Find at-risk students (GPA < 2.0)
GET    /v1/students/statistics         # Get enrollment metrics
```

**Sample Usage:**
```bash
# Create student
curl -X POST http://localhost:3001/v1/students \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@university.edu",
    "studentId": "STU001",
    "dateOfBirth": "2002-01-15",
    "status": "active"
  }'

# Get student statistics
curl http://localhost:3001/v1/students/statistics
```

---

### 2. Admissions Service
**Port:** 3003 | **Status:** ✅ Complete

Manages the admissions funnel from leads to enrollment.

**Modules:**
- **Applicants** - Prospect/applicant records, contact info, status tracking
- **Applications** - Program applications, GPA tracking, test scores
- **Recommendations** - Admissions recommendations and decisions

**Key Endpoints:**
```
POST   /v1/applicants                  # Create applicant
GET    /v1/applicants                  # List applicants
GET    /v1/applicants/:id              # Get applicant
PATCH  /v1/applicants/:id              # Update applicant
PATCH  /v1/applicants/:id/status       # Update status
GET    /v1/applicants/search           # Search applicants
GET    /v1/applicants/status/:status   # Filter by status
DELETE /v1/applicants/:id              # Delete applicant

POST   /v1/applications                # Create application
GET    /v1/applications                # List applications
GET    /v1/applications/:id            # Get application
PATCH  /v1/applications/:id            # Update application
PATCH  /v1/applications/:id/status     # Update app status
GET    /v1/applications/applicant/:id  # Get applicant's apps
GET    /v1/applications/program/:id    # Get program applications
GET    /v1/applications/term/:term     # Get term applications
```

**Applicant Statuses:** new, reviewing, accepted, rejected, deferred, enrolled

**Application Statuses:** submitted, under_review, accepted, rejected, deferred

---

### 3. Financial Aid Service
**Port:** 3004 | **Status:** ✅ Complete

Manages student billing, charges, payments, and financial aid awards.

**Modules:**
- **StudentAccounts** - Billing accounts with balance tracking
- **Charges** - Tuition, fees, and other charges
- **Payments** - Payment processing and tracking
- **FinancialAidAwards** - Scholarships, grants, loans, work-study

**Key Endpoints:**
```
# Student Accounts
GET    /v1/accounts/:studentId         # Get student account
GET    /v1/accounts/:studentId/balance # Get account balance
GET    /v1/accounts                    # List all accounts
GET    /v1/accounts/outstanding/all    # Outstanding balances

# Charges
POST   /v1/charges                     # Create charge
GET    /v1/charges/:id                 # Get charge
GET    /v1/charges/account/:accountId  # Get account charges
GET    /v1/charges/account/:accountId/open  # Get open charges
GET    /v1/charges/account/:accountId/total-due  # Total due
GET    /v1/charges/overdue             # Get overdue charges
PATCH  /v1/charges/:id/pay             # Mark charge as paid

# Payments
POST   /v1/payments                    # Process payment
GET    /v1/payments/:id                # Get payment
GET    /v1/payments/account/:accountId # Account payments
GET    /v1/payments/method/:method     # Payments by method
GET    /v1/payments/total-received     # Total revenue
GET    /v1/payments/date-range         # Payments in date range
PATCH  /v1/payments/:id/status         # Update payment status
POST   /v1/payments/:id/refund         # Refund payment

# Financial Aid
POST   /v1/financial-aid               # Create award
GET    /v1/financial-aid/:id           # Get award
GET    /v1/financial-aid/account/:id   # Student's awards
GET    /v1/financial-aid/type/:type    # Awards by type
GET    /v1/financial-aid/status/:status # Awards by status
GET    /v1/financial-aid/total-awarded # Total awarded
PATCH  /v1/financial-aid/:id/status    # Update award status
POST   /v1/financial-aid/:id/disburse  # Record disbursement
```

**Sample Usage:**
```bash
# Create charge
curl -X POST http://localhost:3001/v1/charges \
  -H "Content-Type: application/json" \
  -d '{
    "studentAccountId": "ACC-001",
    "chargeType": "tuition",
    "amount": 5000,
    "chargeDate": "2026-01-15",
    "dueDate": "2026-02-15"
  }'

# Process payment
curl -X POST http://localhost:3001/v1/payments \
  -H "Content-Type: application/json" \
  -d '{
    "studentAccountId": "ACC-001",
    "chargeIds": ["CHARGE-001"],
    "amount": 5000,
    "paymentMethod": "credit_card"
  }'
```

---

### 4. HR Service
**Port:** 3002 | **Status:** ✅ Complete

Manages faculty, staff, and payroll information.

**Modules:**
- **Faculty** - Faculty records, departments, specializations, research interests
- **Employees** - Staff records, positions, employment types, reporting structure
- **Payroll** - Payroll processing and compensation (foundation for expansion)

**Key Endpoints:**
```
# Faculty
POST   /v1/faculty                     # Create faculty
GET    /v1/faculty                     # List faculty
GET    /v1/faculty/:id                 # Get faculty
PATCH  /v1/faculty/:id                 # Update faculty
PATCH  /v1/faculty/:id/status          # Update status
GET    /v1/faculty/department/:dept    # Faculty by department
GET    /v1/faculty/status/:status      # Faculty by status
GET    /v1/faculty/statistics          # Faculty statistics

# Employees
POST   /v1/employees                   # Create employee
GET    /v1/employees                   # List employees
GET    /v1/employees/:id               # Get employee
PATCH  /v1/employees/:id               # Update employee
PATCH  /v1/employees/:id/status        # Update status
GET    /v1/employees/department/:dept  # By department
GET    /v1/employees/status/:status    # By status
GET    /v1/employees/manager/:id/reports  # Direct reports
GET    /v1/employees/statistics        # Employee statistics
```

**Status Values:** active, inactive, on_leave

---

### 5. Analytics Service
**Port:** 3003 | **Status:** ✅ Complete

Provides dashboards, reporting, and business intelligence.

**Modules:**
- **Dashboards** - Pre-built dashboards for different roles
- **Reports** - Custom reporting (scaffold for expansion)
- **Metrics** - KPI and metric calculations (scaffold)

**Key Endpoints:**
```
GET    /v1/dashboards/institution     # Institution overview dashboard
GET    /v1/dashboards/student-performance  # Student performance metrics
GET    /v1/dashboards/admissions      # Admissions funnel & metrics
GET    /v1/dashboards/financial       # Financial reporting dashboard
GET    /v1/dashboards/hr              # HR/workforce analytics
```

**Dashboard Data:**
- **Institution:** Student count, active enrollments, programs, revenue
- **Student Performance:** Average GPA, at-risk students, probation count
- **Admissions:** Total applicants, status breakdown, conversion rate
- **Financial:** Total charges, payments, outstanding balance, collections rate
- **HR:** Faculty count, staff count, department breakdown, salary averages

---

## 🔐 API Gateway
**Port:** 3001 | **Status:** ✅ Active

Central entry point for all API requests.

**Features:**
- Request routing to backend services
- Authentication enforcement
- Multi-tenant context extraction (X-Tenant-ID header)
- Rate limiting and throttling
- Request/response transformation
- Health checks for all services

**Health Endpoints:**
```
GET    /health                        # Gateway health
GET    /health/services               # Status of all services
```

---

## 🎨 Frontend Applications

### Student Portal
**Port:** 3010 | **Technology:** Next.js 15, React, TailwindCSS

**Features:**
- Student dashboard with key metrics
- Course enrollment and viewing
- Grade checking
- Transcript access
- Account balance viewing
- Financial aid status

**Key Pages:**
- `/` - Dashboard
- `/courses` - Course listing and enrollment
- `/grades` - Grade viewing
- `/transcript` - Transcript access
- `/account` - Financial account status

---

## 📊 Monitoring & Infrastructure

### Grafana (Monitoring)
**URL:** http://localhost:3000
**Credentials:** admin / admin

Predefined dashboards for:
- API Gateway metrics
- Service health and performance
- Database performance
- Event pipeline health

### Prometheus (Metrics)
**URL:** http://localhost:9090

Metrics endpoints available on each service:
```
GET    /metrics                       # Prometheus metrics
```

### Keycloak (Authentication)
**URL:** http://localhost:8080
**Credentials:** admin / admin

Authentication and authorization server. All services use Keycloak for:
- User authentication
- Role-based access control
- OAuth2/OpenID Connect integration

### PostgreSQL (Database)
**Port:** 5432
**Credentials:** postgres / postgres

Central database for all services using:
- Prisma ORM
- Row-Level Security (RLS) for multi-tenancy
- Audit logging via triggers

---

## 🔄 Event-Driven Architecture

Services publish events to Kafka for:
- Student lifecycle events (created, updated, enrolled, graduated)
- Application status changes
- Payment processing events
- Charge updates

Event topics:
- `student.created`, `student.updated`, `student.deleted`
- `application.submitted`, `application.decided`
- `payment.processed`, `payment.refunded`
- `charge.created`, `charge.paid`

---

## 🚀 Deployment

### Docker Compose (Local Development)
```bash
docker-compose up -d
```

### Kubernetes (Production)
```bash
kubectl apply -f k8s/
```

### Environment Variables

Each service requires:
```
PORT=<port>
NODE_ENV=development
DATABASE_URL=postgresql://user:password@host:5432/db
CURRENT_TENANT_ID=default-tenant
LOG_LEVEL=debug
CORS_ORIGIN=http://localhost:3000
```

---

## 📈 Data Isolation (Multi-Tenancy)

All data is isolated by tenant using:
1. **Database Level:** Row-Level Security (RLS) in PostgreSQL
2. **Application Level:** `tenantId` parameter in all queries
3. **API Level:** `X-Tenant-ID` header extraction

Every data model includes a `tenantId` field ensuring complete isolation.

---

## 🔄 Service Integration

Services communicate via:
1. **HTTP/REST** - Synchronous requests through API Gateway
2. **GraphQL** - Each service exposes GraphQL schema
3. **Kafka** - Event-driven asynchronous communication

All service-to-service communication goes through the API Gateway for:
- Consistent authentication
- Request tracking
- Rate limiting
- Monitoring

---

## 📝 Changelog

### Latest Changes
- Implemented Analytics Service with comprehensive dashboards
- Completed HR Service with faculty and employee management
- Completed Financial Aid Service with payments and awards
- Completed Admissions Service with full applicant tracking
- Enhanced SIS Service with academic transcript support
- Added multi-tenant isolation at database level
- Implemented event publishing for all major operations

---

## 🤝 Contributing

To add a new service:
1. Create service directory in `services/`
2. Initialize with NestJS scaffolding
3. Implement Repository → Service → Controller pattern
4. Add Prisma integration
5. Document endpoints in this guide
6. Add health checks and monitoring

See [Contributing Guide](CONTRIBUTING.md) for detailed instructions.

---

## 📚 Additional Resources

- [System Architecture](docs/ARCHITECTURE.md)
- [Database Schema](docs/DATABASE_SCHEMA.md)
- [API Design Guidelines](docs/API_DESIGN.md)
- [Development Guide](docs/DEVELOPMENT.md)
- [Implementation Guide](docs/IMPLEMENTATION_GUIDE.md)
