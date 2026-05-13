# OpenCampusOS Services Inventory

Complete list of 31+ implemented microservices for the OpenCampusOS platform.

## Service Architecture Overview

All services follow a consistent NestJS-based architecture with TypeScript, PostgreSQL/Prisma, and GraphQL Federation support.

### Services by Category

**Platform Services (3011-3016)**: Core infrastructure - Notifications, API Gateway, Auth, Audit
**Core Services (3017-3027)**: Analytics, Search, Integration, Workflow, Recommendations, Mobile Gateway, Content, Event Bus
**Academic Services (3028+)**: Course Catalog, Surveys, Student Success, Recommendations
**Administrative Services (3029-3031)**: Room Scheduling, Finance & Accounting, HR & Payroll

## Complete Service List

| Port | Service | Purpose | Status |
|------|---------|---------|--------|
| 3011 | Notification | Email, SMS, push notifications | ✅ |
| 3012 | API Gateway | Request routing, auth, rate limiting | ✅ |
| 3013 | Auth Service | OAuth2, SAML, MFA, RBAC | ✅ |
| 3014 | Audit Service | Activity logging, compliance | ✅ |
| 3015 | Audit Service | Audit trails, change tracking | ✅ |
| 3017 | Analytics | Dashboards, metrics, KPIs | ✅ |
| 3018 | Search | Full-text & semantic search | ✅ |
| 3019 | Integration | LMS/ERP connectors | ✅ |
| 3020 | Workflow Engine | Process automation | ✅ |
| 3021 | Recommendations | AI-powered suggestions | ✅ |
| 3022 | Mobile Gateway | GraphQL federation | ✅ |
| 3023 | Cost Analysis | Budget analysis & forecasting | ✅ |
| 3024 | Content Library | Resource management | ✅ |
| 3025 | Event Bus | Kafka-based streaming | ✅ |
| 3026 | Student Success | Academic planning & advising | ✅ |
| 3027 | Surveys | Course evaluations & feedback | ✅ |
| 3028 | Course Catalog | Courses, programs, prerequisites | ✅ |
| 3029 | Room Scheduling | Facility management | ✅ |
| 3030 | Finance | Accounting & budgeting | ✅ |
| 3031 | HR & Payroll | Employee & payroll management | ✅ |

## Service Details

Each service includes:
- NestJS framework
- PostgreSQL with Prisma ORM
- GraphQL Federation support
- REST API endpoints
- Health check endpoints
- Multi-tenant isolation
- Audit logging
- Prometheus metrics
- TypeScript strict mode
- Comprehensive error handling

## Key Features

### Multi-Tenant Support
- X-Tenant-ID header for request routing
- Row-Level Security in database
- Tenant-scoped data isolation
- Per-tenant configuration

### API Standards
- REST endpoints
- GraphQL schemas
- OpenAPI/Swagger docs
- Consistent error handling
- Request validation

### Operational Features
- Health checks (/health, /health/live, /health/ready)
- Prometheus metrics
- Structured logging
- Audit trails
- Configuration via .env files

See SERVICES.md for detailed documentation.
