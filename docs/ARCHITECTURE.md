# OpenCampusOS System Architecture

## High-Level Overview

OpenCampusOS is an enterprise-grade, event-driven, microservices-based Higher Education Operating System built with cloud-native technologies.

### Architecture Principles

1. **Modularity**: Each domain (SIS, Admissions, Finance, HR) is a self-contained service
2. **API-First**: All communication happens through well-defined REST/GraphQL APIs
3. **Event-Driven**: State changes propagate through Kafka topics for eventual consistency
4. **Multi-Tenant**: Complete data isolation per institution
5. **AI-Native**: Every module supports AI copilots, semantic search, and recommendations
6. **Self-Hosted**: Can run on-prem or in any cloud (AWS, GCP, Azure)

---

## System Components

### 1. API Gateway
**Technology**: Kong / NestJS Express Adapter
**Responsibilities**:
- Request routing to services
- Authentication validation
- Rate limiting
- Request/response transformation
- API versioning
- OpenAPI documentation

### 2. Authentication Service
**Technology**: Keycloak
**Features**:
- OAuth2.0 / OpenID Connect
- SAML 2.0 support
- CAS protocol
- LDAP/Active Directory integration
- Multi-factor authentication (TOTP, SMS, WebAuthn)
- Role-based access control (RBAC)
- Attribute-based access control (ABAC)

### 3. Core Microservices

#### SIS Service (Student Information System)
- Student profiles & lifecycle
- Enrollment management
- Class scheduling
- Registration workflows
- Degree audits
- Transcripts
- Academic standing
- Attendance

**DB**: PostgreSQL (SIS schema)
**Events**: student.enrolled, student.registered, grade.submitted
**API**: REST + GraphQL

#### Admissions Service
- Application intake
- Lead management & nurturing
- Recommendation tracking
- Document management
- Application scoring
- Applicant communications
- Student onboarding

**DB**: PostgreSQL (Admissions schema)
**Events**: applicant.created, application.submitted, student.admitted
**API**: REST + GraphQL

#### Financial Aid Service
- Aid packages
- Scholarship management
- Loan tracking
- FAFSA integration
- Award calculations
- Student financial dashboard

**DB**: PostgreSQL (FinAid schema)
**Events**: aid.awarded, scholarship.allocated
**API**: REST + GraphQL

#### ERP/Finance Service
- General ledger
- Procurement
- Budgeting
- Invoicing
- Tuition billing
- Cost accounting

**DB**: PostgreSQL (Finance schema)
**Events**: invoice.created, payment.received, budget.updated
**API**: REST + GraphQL

#### HR Service
- Faculty & staff management
- Hiring workflows
- Payroll
- Benefits
- Leave management
- Performance reviews

**DB**: PostgreSQL (HR schema)
**Events**: employee.hired, payroll.processed
**API**: REST + GraphQL

#### Workflow Engine
- Drag-and-drop workflow builder
- Trigger/action automation
- Approval chains
- Conditional logic
- Integration with all services

**DB**: PostgreSQL (Workflows schema)
**Events**: workflow.created, step.completed, workflow.terminated
**API**: REST

#### Analytics Service
- Real-time metrics
- Enrollment analytics
- Revenue analytics
- Student success analytics
- AI forecasting
- Custom dashboards (Low-code builder)

**DB**: PostgreSQL, ClickHouse (time-series), Elasticsearch (metrics)
**Events**: Consumes all events from other services
**API**: REST + GraphQL

#### AI Platform Service
- LLM integration (OpenAI, Ollama)
- Vector embeddings (pgvector + Qdrant)
- RAG (Retrieval-Augmented Generation)
- Semantic search
- Copilot orchestration
- Prompt templates
- Fine-tuning & RLHF

**DB**: Qdrant (vector DB), PostgreSQL (metadata)
**Events**: Publishes copilot.query, copilot.response events
**API**: REST + WebSocket

#### LMS Integration Hub
- Canvas, Moodle, Blackboard adapters
- LTI protocol support
- Grade syncing
- Roster syncing
- Assignment syncing
- Learning analytics aggregation

**DB**: PostgreSQL (LMS schema)
**Events**: grade.synced, roster.synced
**API**: REST

### 4. Data Layer

#### Primary Database: PostgreSQL
**Purpose**: Transactional data, source of truth
**Schema**: Multi-schema approach (one per service)
  - sis_schema
  - admissions_schema
  - finance_schema
  - hr_schema
  - auth_schema
  - workflow_schema
  - lms_schema

**Features**:
- Row-level security (RLS)
- Audit logging (every table has created_at, updated_at, deleted_at)
- Event triggers for Kafka publish
- Multi-tenant isolation (tenant_id on every table)
- Temporal tables for history

#### Redis
**Purpose**: Caching, sessions, rate limiting
**Usage**:
- User sessions (Keycloak)
- API rate limit counters
- Cache for popular queries
- Real-time notifications

#### ClickHouse
**Purpose**: Analytics, time-series data
**Data**:
- Event analytics
- Metric aggregations
- Historical trends
- Performance metrics

#### Elasticsearch / OpenSearch
**Purpose**: Full-text search, log aggregation
**Indices**:
- Student records search
- Course catalog search
- Faculty directory search

#### Qdrant
**Purpose**: Vector storage for AI
**Collections**:
- Course embeddings
- Student profile embeddings
- Document embeddings
- FAQ embeddings

### 5. Event Streaming: Kafka

**Topics**:
```
students.events
  - student.created
  - student.enrolled
  - student.graduated
  - grade.submitted

admissions.events
  - applicant.created
  - application.submitted
  - student.admitted

finance.events
  - invoice.created
  - payment.received
  - refund.issued

workflow.events
  - workflow.started
  - step.completed
  - approval.requested

ai.events
  - copilot.query
  - copilot.response
  - embedding.created
```

**Event Schema**:
```json
{
  "id": "uuid",
  "type": "student.enrolled",
  "aggregate_id": "student-123",
  "aggregate_type": "Student",
  "tenant_id": "university-456",
  "timestamp": "2026-05-13T10:00:00Z",
  "version": 1,
  "data": {},
  "metadata": {
    "user_id": "admin-123",
    "ip": "192.168.1.1",
    "request_id": "req-123"
  }
}
```

### 6. Frontend Applications

#### Next.js Admin Dashboard
- Institutional administration
- User management
- System configuration
- Analytics & reporting
- Settings & compliance

#### React Student Portal
- Course registration
- Grades & transcripts
- Financial aid status
- Student communications
- AI academic advisor

#### React Faculty Portal
- Class rosters & grading
- Attendance tracking
- Student communication
- Course materials
- AI teaching assistant

#### React Admissions Portal
- Application intake
- Document uploads
- Status tracking
- Student onboarding

### 7. Authentication Architecture

```
┌─────────────────────────────────────────┐
│   Client (Web/Mobile)                   │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│   API Gateway (Kong/Auth Middleware)    │
│   - JWT validation                      │
│   - RBAC/ABAC check                     │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│   Keycloak                              │
│   - OAuth2/OIDC provider                │
│   - SAML endpoint                       │
│   - CAS endpoint                        │
│   - User federation (LDAP)              │
└─────────────────────────────────────────┘
```

### 8. Service-to-Service Communication

**Internal (gRPC)**:
- High-throughput, low-latency
- Services calling services (e.g., SIS → Analytics)
- Request/response patterns

**External (REST/GraphQL)**:
- Public APIs for integrations
- Mobile apps
- Third-party integrations
- Webhooks for external listeners

### 9. Deployment Architecture

```
┌──────────────────────────────────────────────────────┐
│         Kubernetes Cluster                          │
├──────────────────────────────────────────────────────┤
│                                                      │
│  ┌──────────────────────────────────────────────┐  │
│  │  Ingress Controller (NGINX/Kong)             │  │
│  └───────────────────┬──────────────────────────┘  │
│                      │                              │
│  ┌──────────────────┴──────────────────────────┐  │
│  │  API Gateway Service                        │  │
│  └───────────────────┬──────────────────────────┘  │
│                      │                              │
│  ┌──────────────────┴──────────────────────────┐  │
│  │  Service Mesh (Istio)                       │  │
│  │  - Circuit breaking                         │  │
│  │  - Retry policies                           │  │
│  │  - Canary deployments                       │  │
│  └───────────────────┬──────────────────────────┘  │
│                      │                              │
│  ┌──────────────────┴──────────────────────────┐  │
│  │  Microservices (NestJS)                     │  │
│  │  - SIS Service (3 replicas)                 │  │
│  │  - Admissions Service (3 replicas)          │  │
│  │  - Finance Service (2 replicas)             │  │
│  │  - HR Service (2 replicas)                  │  │
│  │  - Analytics Service (2 replicas)           │  │
│  │  - AI Platform Service (2 GPUs)             │  │
│  │  - Workflow Engine (2 replicas)             │  │
│  └──────────────────────────────────────────────┘  │
│                                                      │
│  ┌──────────────────────────────────────────────┐  │
│  │  Data Layer (External / StatefulSets)        │  │
│  │  - PostgreSQL (Managed RDS)                  │  │
│  │  - Redis (ElastiCache / StatefulSet)         │  │
│  │  - Kafka (3-node cluster)                    │  │
│  │  - ClickHouse (Analytics cluster)            │  │
│  └──────────────────────────────────────────────┘  │
│                                                      │
└──────────────────────────────────────────────────────┘
```

### 10. CI/CD Pipeline

**GitHub Actions**:
1. **Lint & Type-Check** (on PR)
   - ESLint, Prettier
   - TypeScript compilation
   - Dependency audit

2. **Unit Tests** (on PR)
   - Jest tests for all packages
   - Coverage reports

3. **Integration Tests** (on PR)
   - Docker Compose environment
   - Database tests
   - API integration tests

4. **Build** (on merge to main)
   - Build all services
   - Build frontend apps
   - Create Docker images
   - Push to Docker registry

5. **Deploy to Staging** (on merge to main)
   - Deploy via ArgoCD
   - Run smoke tests
   - Database migrations

6. **Deploy to Production** (on release tag)
   - Blue-green deployment
   - Health checks
   - Rollback on failure

### 11. Observability Stack

**Prometheus**: Metrics collection
**Grafana**: Metrics visualization & alerting
**Loki**: Log aggregation
**Jaeger**: Distributed tracing
**OpenTelemetry**: Instrumentation standard

All services export:
- Request duration
- Error rates
- Business metrics (enrollments, admissions, etc.)
- Database query performance
- API latency

---

## Data Flow Examples

### Example 1: Student Registration

```
1. Student submits registration via Student Portal
   ↓
2. SIS Service receives registration request (REST)
   ↓
3. SIS validates: credit limits, prerequisites, enrollment caps
   ↓
4. SIS publishes student.registered event to Kafka
   ↓
5. Analytics Service consumes event, updates enrollment metrics
6. Finance Service consumes event, calculates tuition charges
7. Workflow Engine consumes event, triggers confirmation email
8. AI Platform consumes event, updates student embeddings
```

### Example 2: AI Semantic Search

```
1. Student asks: "What classes meet my math requirement?"
   ↓
2. AI Platform Service receives query
   ↓
3. Converts question to embedding (OpenAI)
   ↓
4. Semantic search in Qdrant (course embeddings)
   ↓
5. Retrieves relevant courses from SIS via REST API
   ↓
6. Generates response using RAG + LLM
   ↓
7. Returns formatted answer to Student Portal
```

---

## Security Architecture

### Data Isolation
- Every table has `tenant_id`
- Row-level security (RLS) enforced in PostgreSQL
- Redis keys scoped by tenant
- Kafka messages include tenant_id

### Audit Trails
- All state changes logged in audit tables
- Event sourcing for critical workflows
- Immutable audit logs in separate schema

### Encryption
- TLS 1.3 for all transit
- AES-256 for sensitive fields (SSN, bank info)
- JWKS for API token validation

### Compliance
- FERPA-compliant data handling
- GDPR right-to-be-forgotten support
- SOC2 audit logging
- PCI-DSS for payment data

---

## Scalability Considerations

### Horizontal Scaling
- Stateless microservices (easy K8s scaling)
- Kafka for loose coupling
- Redis for distributed session state

### Vertical Scaling
- PostgreSQL read replicas for analytics
- ClickHouse for time-series aggregations
- CDN for static assets

### Performance Optimization
- GraphQL federation for efficient querying
- Redis caching layer
- Database query optimization
- API response compression

---

## Next Steps

1. Define detailed database schema (Prisma)
2. Implement core authentication service
3. Build SIS service foundation
4. Set up event streaming infrastructure
5. Deploy to Kubernetes
6. Implement frontend applications
