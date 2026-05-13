# OpenCampusOS API Design

## Overview

OpenCampusOS provides three complementary API layers for different use cases:

1. **REST APIs** - Traditional, widely-supported HTTP APIs
2. **GraphQL APIs** - Flexible, efficient querying with schema federation
3. **gRPC APIs** - High-performance service-to-service communication

All APIs:
- Support multi-tenancy via `tenant_id` header
- Use JWT bearer token authentication
- Include OpenAPI/GraphQL documentation
- Are versioned (v1, v2, etc.)
- Support webhooks for event subscriptions

---

## REST API Structure

### Base URL
```
Production: https://api.opencampus.edu
Staging: https://staging-api.opencampus.edu
Development: http://localhost:3001
```

### Authentication
```bash
# Include JWT token in Authorization header
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Standard Headers
```bash
# Multi-tenant context
X-Tenant-ID: 123e4567-e89b-12d3-a456-426614174000

# Request tracking
X-Request-ID: req-123456789

# API version
X-API-Version: 2026-05-01
```

### Response Format
All endpoints return standardized JSON responses:

#### Success (2xx)
```json
{
  "status": "success",
  "data": {
    "id": "stu-123",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com"
  },
  "meta": {
    "timestamp": "2026-05-13T10:00:00Z",
    "requestId": "req-123"
  }
}
```

#### Error (4xx, 5xx)
```json
{
  "status": "error",
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid email format",
    "details": [
      {
        "field": "email",
        "message": "Must be a valid email address"
      }
    ]
  },
  "meta": {
    "timestamp": "2026-05-13T10:00:00Z",
    "requestId": "req-123"
  }
}
```

### Pagination
```bash
GET /api/v1/students?page=1&limit=20&sort=-createdAt

Response:
{
  "status": "success",
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 5000,
    "pages": 250,
    "hasMore": true
  }
}
```

### Filtering
```bash
# Query by status
GET /api/v1/students?status=active

# Multiple filters
GET /api/v1/students?status=active&programId=prog-123&gpa[gte]=3.0

# Full-text search
GET /api/v1/students?search=john+doe&searchFields=firstName,lastName,email
```

### Rate Limiting
```
Rate-Limit-Limit: 1000
Rate-Limit-Remaining: 999
Rate-Limit-Reset: 1650000000
```

---

## REST Endpoints

### SIS Service

#### Students
```
POST   /api/v1/students              # Create student
GET    /api/v1/students              # List students
GET    /api/v1/students/:id          # Get student details
PATCH  /api/v1/students/:id          # Update student
DELETE /api/v1/students/:id          # Delete student (soft)
```

#### Enrollments
```
POST   /api/v1/enrollments           # Enroll student
GET    /api/v1/enrollments           # List enrollments
GET    /api/v1/enrollments/:id       # Get enrollment
PATCH  /api/v1/enrollments/:id       # Update enrollment
DELETE /api/v1/enrollments/:id       # Drop course
```

#### Courses
```
POST   /api/v1/courses               # Create course
GET    /api/v1/courses               # List courses
GET    /api/v1/courses/:id           # Get course details
PATCH  /api/v1/courses/:id           # Update course
DELETE /api/v1/courses/:id           # Delete course
```

#### Transcripts
```
GET    /api/v1/students/:id/transcript  # Get student transcript
POST   /api/v1/transcripts            # Generate transcript
```

### Admissions Service

#### Applications
```
POST   /api/v1/applications          # Submit application
GET    /api/v1/applications          # List applications
GET    /api/v1/applications/:id      # Get application
PATCH  /api/v1/applications/:id      # Update application
DELETE /api/v1/applications/:id      # Withdraw application
```

#### Applicants
```
POST   /api/v1/applicants            # Create applicant
GET    /api/v1/applicants            # List applicants
GET    /api/v1/applicants/:id        # Get applicant details
PATCH  /api/v1/applicants/:id        # Update applicant
```

### Finance Service

#### Student Accounts
```
GET    /api/v1/accounts/:studentId   # Get account balance
GET    /api/v1/accounts/:studentId/charges  # List charges
POST   /api/v1/accounts/:studentId/payments # Make payment
GET    /api/v1/accounts/:studentId/payments # Payment history
```

### Analytics Service

#### Dashboards
```
GET    /api/v1/dashboards            # List dashboards
GET    /api/v1/dashboards/:id        # Get dashboard
POST   /api/v1/dashboards            # Create custom dashboard
```

#### Reports
```
GET    /api/v1/reports/enrollment    # Enrollment metrics
GET    /api/v1/reports/retention     # Retention analytics
GET    /api/v1/reports/revenue       # Revenue analytics
GET    /api/v1/reports/success       # Student success metrics
```

---

## GraphQL API

### Endpoint
```
POST /graphql
Authorization: Bearer token...
X-Tenant-ID: tenant-123
```

### Schema Federation

The API uses Apollo Federation to stitch together schemas from multiple services:

```graphql
# Query all students with their enrollments
query {
  students(filter: { status: ACTIVE }) {
    id
    firstName
    lastName
    email
    program {
      name
      degreeLevel
    }
    enrollments {
      course {
        code
        title
        credits
      }
      grade
      status
    }
  }
}
```

### Mutations

```graphql
# Enroll a student
mutation EnrollStudent($input: EnrollmentInput!) {
  enrollStudent(input: $input) {
    id
    student {
      id
      firstName
    }
    section {
      course {
        code
      }
    }
    status
  }
}
```

### Subscriptions

```graphql
# Real-time grade updates
subscription OnGradeSubmitted($studentId: ID!) {
  gradeSubmitted(studentId: $studentId) {
    enrollment {
      id
      student {
        firstName
      }
      course {
        code
      }
    }
    grade
    submittedAt
  }
}
```

---

## WebSocket API (Real-Time)

### Connection
```
wss://api.opencampus.edu/ws?token=jwt-token&tenant=tenant-123
```

### Subscription Messages
```json
{
  "type": "subscribe",
  "channel": "grade.submitted",
  "filter": {
    "studentId": "stu-123"
  }
}
```

### Event Messages
```json
{
  "type": "event",
  "channel": "grade.submitted",
  "data": {
    "enrollmentId": "enr-456",
    "grade": "A",
    "submittedAt": "2026-05-13T10:00:00Z"
  }
}
```

---

## Webhooks

### Creating a Webhook
```bash
POST /api/v1/webhooks
{
  "url": "https://myapp.com/webhooks/opencampus",
  "events": [
    "student.enrolled",
    "grade.submitted",
    "application.submitted"
  ],
  "headers": {
    "Authorization": "Bearer my-token"
  }
}
```

### Webhook Payload
```json
{
  "id": "wh-123",
  "timestamp": "2026-05-13T10:00:00Z",
  "event": "student.enrolled",
  "tenantId": "tenant-123",
  "data": {
    "studentId": "stu-123",
    "sectionId": "sec-456",
    "enrollmentDate": "2026-05-13"
  }
}
```

### Webhook Security
- HMAC-SHA256 signature in `X-Signature` header
- Verify signature with webhook secret
- Idempotent processing with `X-Webhook-ID`

---

## Error Codes

| Code | Status | Description |
|------|--------|-------------|
| VALIDATION_ERROR | 400 | Request validation failed |
| UNAUTHORIZED | 401 | Missing or invalid authentication |
| FORBIDDEN | 403 | Insufficient permissions |
| NOT_FOUND | 404 | Resource not found |
| CONFLICT | 409 | Resource already exists or state conflict |
| UNPROCESSABLE_ENTITY | 422 | Business logic validation failed |
| RATE_LIMITED | 429 | Rate limit exceeded |
| INTERNAL_ERROR | 500 | Server error |
| SERVICE_UNAVAILABLE | 503 | Service temporarily unavailable |

---

## SDK & Client Libraries

### TypeScript/JavaScript
```typescript
import { OpenCampusClient } from '@opencampus/sdk-js';

const client = new OpenCampusClient({
  apiKey: 'your-api-key',
  tenantId: 'your-tenant-id'
});

const students = await client.sis.students.list({ status: 'active' });
```

### Python
```python
from opencampus_sdk import OpenCampusClient

client = OpenCampusClient(
    api_key='your-api-key',
    tenant_id='your-tenant-id'
)

students = client.sis.students.list(status='active')
```

### Go
```go
import "github.com/opencampus-sh/sdk-go"

client := opencampus.NewClient(apiKey, tenantID)
students, err := client.SIS.Students.List(ctx, &opencampus.ListOptions{})
```

---

## API Versioning

We use date-based versioning:
- Current version: `2026-05-13`
- Stable version: `2026-05-01`
- Preview version: `2026-06-01-preview`

Specify version in header:
```
X-API-Version: 2026-05-13
```

---

## Best Practices

1. **Always include X-Request-ID** for debugging
2. **Use pagination** for large datasets (default limit: 20, max: 100)
3. **Cache responses** with appropriate TTL headers
4. **Implement exponential backoff** for rate limiting
5. **Validate webhook signatures** before processing
6. **Use GraphQL** for complex multi-entity queries
7. **Use REST** for simple CRUD operations
8. **Subscribe to webhooks** instead of polling

---

## Rate Limits

| Tier | Requests/Hour | Burst |
|------|---------------|-------|
| Free | 100 | 10 |
| Professional | 10,000 | 100 |
| Enterprise | Unlimited | Unlimited |

---

## SDK Development

To contribute an SDK:
1. Use OpenAPI spec: `/openapi.json`
2. Generate client code from spec
3. Include comprehensive examples
4. Add unit tests
5. Publish to package manager (npm, PyPI, go.mod)
