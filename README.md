# OpenCampusOS

The modern AI-native operating system for higher education.

A production-grade, open-source alternative to Ellucian Banner, Colleague, Workday Student, and Oracle Campus Solutions.

## ✨ Features

### ✅ Implemented Services

#### Core Services
- **SIS (Student Information System)** - Student lifecycle, enrollments, transcripts, GPA tracking
- **Admissions** - Applicant management, applications, admissions workflows, conversion tracking
- **Financial Aid** - Student accounts, charges, payments, aid awards, disbursement tracking
- **HR (Human Resources)** - Faculty management, employee records, department organization
- **Analytics** - Institution dashboards, performance metrics, financial reporting, analytics foundation

#### Support Services
- **API Gateway** - Service routing, authentication, rate limiting, request/response transformation
- **Database Layer** - Prisma ORM, multi-tenant isolation via Row-Level Security, audit logging
- **Authentication** - Keycloak integration, OAuth2, JWT, RBAC support

#### Frontend Applications
- **Student Portal** - Dashboard, course enrollment, grade viewing, transcript access
- **Admin Dashboard** - Institution management, user management, settings
- **Faculty Portal** - Class rosters, grading interface, student management (scaffold)

### 🚀 Phase 2 (In Development)
- Workflow automation engine
- ERP & financial accounting
- Advanced payroll system
- Mobile applications (React Native)
- LMS Hub integration
- AI Copilot enhancement

### 📋 Phase 3 (Planned)
- Advanced AI analytics
- Developer marketplace
- Plugin ecosystem
- Enterprise automation
- Mobile apps (complete)

## 🏗️ Architecture

### Monorepo Structure
```
apps/                    # Next.js frontends
services/                # NestJS microservices
packages/                # Shared libraries
infrastructure/          # Docker, K8s, Terraform configs
docs/                    # Architecture & API docs
scripts/                 # Database seeds, migrations
```

### Tech Stack

**Frontend**
- Next.js 15, React, TypeScript
- TailwindCSS, shadcn/ui
- TanStack Query, Zustand

**Backend**
- NestJS microservices
- PostgreSQL, Redis, ClickHouse
- Kafka event streaming
- GraphQL Federation

**AI/ML**
- OpenAI APIs, Ollama
- LangChain, pgvector, Qdrant
- RAG & semantic search

**Infrastructure**
- Docker, Kubernetes, Helm
- Terraform, ArgoCD
- Prometheus, Grafana, Loki

**Authentication**
- Keycloak, OAuth2, SAML, CAS
- MFA, RBAC, ABAC

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- Node.js 20+
- pnpm 9+
- PostgreSQL 16 (optional, included in Docker)

### Development Environment

1. **Clone and install**
```bash
git clone https://github.com/opencampus-sh/opencampus-os.git
cd opencampus-os
pnpm install
```

2. **Start infrastructure**
```bash
docker-compose up -d
```

This starts:
- PostgreSQL (port 5432)
- Redis (port 6379)
- Kafka (port 9092)
- ClickHouse (port 8123)
- Qdrant (port 6333)
- OpenSearch (port 9200)
- Keycloak (port 8080)
- Prometheus (port 9090)
- Grafana (port 3000)
- Loki (port 3100)
- Jaeger (port 16686)

3. **Initialize database**
```bash
pnpm run db:migrate
pnpm run db:seed
```

4. **Start services**
```bash
pnpm dev
```

This starts all services and apps in development mode:
- API Gateway (localhost:3001)
- SIS Service (localhost:3002)
- HR Service (localhost:3002)
- Analytics Service (localhost:3003)
- Admissions Service (localhost:3003)
- Financial Aid Service (localhost:3004)
- Student Portal (localhost:3010)
- Admin Dashboard (localhost:3000)

### Service Architecture

| Service | Port | Purpose | Status |
|---------|------|---------|--------|
| API Gateway | 3001 | Route requests to backend services | ✅ Active |
| SIS Service | 3002 | Student enrollment, courses, transcripts | ✅ Complete |
| HR Service | 3002 | Faculty, employees, payroll foundation | ✅ Complete |
| Analytics Service | 3003 | Dashboards, reporting, metrics | ✅ Complete |
| Admissions Service | 3003 | Applicants, applications, admissions | ✅ Complete |
| Financial Aid Service | 3004 | Accounts, charges, payments, awards | ✅ Complete |

### Application Access Points

| Application | URL | Purpose |
|-------------|-----|---------|
| Student Portal | http://localhost:3010 | Student self-service (dashboard, courses, grades) |
| Admin Dashboard | http://localhost:3000 | Institution management and analytics |
| API Documentation | http://localhost:3001/api | OpenAPI/Swagger docs |

### Infrastructure Access Points

| Service | URL | Credentials |
|---------|-----|-------------|
| Keycloak (Auth) | http://localhost:8080 | admin / admin |
| Grafana (Monitoring) | http://localhost:3000 | admin / admin |
| Prometheus (Metrics) | http://localhost:9090 | - |
| Jaeger (Tracing) | http://localhost:16686 | - |
| Kafdrop (Kafka UI) | http://localhost:9000 | - |
| Postgres (Database) | localhost:5432 | postgres / postgres |
| Adminer (DB UI) | http://localhost:8081 | - |

## 📚 Documentation

- [System Architecture](docs/ARCHITECTURE.md)
- [Database Schema](docs/DATABASE_SCHEMA.md)
- [API Design](docs/API_DESIGN.md)
- [Contributing Guide](CONTRIBUTING.md)
- [Development Guide](docs/DEVELOPMENT.md)

## 🛠️ Development Commands

### Service Development

```bash
# Install dependencies
pnpm install

# Start all services in watch mode
pnpm dev

# Build all services for production
pnpm build

# Build only backend services
pnpm build:services

# Build only frontend apps
pnpm build:apps

# Run tests across all packages
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run specific service
pnpm --filter @opencampusos/sis-service dev
pnpm --filter @opencampusos/hr-service dev
pnpm --filter @opencampusos/financial-aid-service dev
pnpm --filter @opencampusos/admissions-service dev
pnpm --filter @opencampusos/analytics-service dev
```

### Database

```bash
# Run database migrations
pnpm run db:migrate

# Seed database with test data
pnpm run db:seed

# Open Prisma Studio (visual database editor)
pnpm run db:studio

# Generate Prisma client
pnpm --filter @opencampus/database run prisma:generate
```

### Docker & Infrastructure

```bash
# Start all infrastructure services
docker-compose up -d

# View service logs
docker-compose logs -f

# Stop all services
docker-compose down

# Reset all services
docker-compose down -v
pnpm test

# Run tests in watch mode
pnpm test:watch

# Lint code
pnpm lint

# Format code
pnpm format

# Type checking
pnpm type-check

# Database commands
pnpm run db:migrate    # Run migrations
pnpm run db:seed       # Seed test data
pnpm run db:studio     # Open Prisma Studio

# Docker commands
pnpm run docker:build  # Build Docker images
pnpm run docker:up     # Start Docker containers
pnpm run docker:down   # Stop Docker containers
pnpm run docker:logs   # View Docker logs

# Kubernetes
pnpm run k8s:deploy    # Deploy to Kubernetes
pnpm run k8s:rollout   # Check rollout status
```

## 🏫 Sample Data

The database is automatically seeded with:
- 1 test institution (Test University)
- Sample admin, student, and faculty users
- 5 academic programs
- 10+ courses
- Academic terms (Spring 2026, Fall 2026)

Login with:
- **Admin**: admin@testuniversity.edu / admin
- **Student**: student@testuniversity.edu / student
- **Faculty**: faculty@testuniversity.edu / faculty

## 📊 Monitoring & Observability

### Grafana Dashboards
Predefined dashboards for:
- System health
- Request latency
- Error rates
- Database performance
- Event streaming
- AI platform metrics

### Prometheus Metrics
All services export metrics for:
- Request rate, latency, errors
- Database connections
- Memory & CPU usage
- Business metrics (enrollments, applications, etc.)

### Distributed Tracing
Jaeger integration for tracing requests across services:
- Service-to-service calls
- Database queries
- External API calls

### Log Aggregation
Loki aggregates logs from all services:
- Searchable by service, level, trace ID
- Integrated with Grafana

## 🔐 Security

- **FERPA Compliance** - Student data protection
- **GDPR Ready** - Right-to-be-forgotten, data export
- **SOC2 Audit Trails** - Complete activity logging
- **Encryption** - TLS 1.3, AES-256 for sensitive data
- **Multi-Tenant Isolation** - Row-level security
- **RBAC & ABAC** - Fine-grained permissions

## 🤝 Contributing

We welcome contributions! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Commit changes with descriptive messages
4. Push to your fork
5. Create a Pull Request

### Code Standards
- TypeScript for all code
- ESLint & Prettier for formatting
- 80%+ test coverage
- API documentation required

## 📜 License

OpenCampusOS is licensed under the AGPL-3.0 License. See [LICENSE](LICENSE) for details.

## 🎯 Roadmap

### 2026 Q2
- Phase 1 MVP launch
- Core SIS & Admissions functionality
- AI copilot beta

### 2026 Q3-Q4
- Phase 2: Finance, HR, Workflow Engine
- Mobile apps (React Native)
- Marketplace alpha

### 2027
- Phase 3: Advanced AI, Plugin ecosystem
- Enterprise deployments
- Managed hosting

## 🙋 Support

- **Documentation**: https://docs.opencampus.sh
- **Discord Community**: https://discord.gg/opencampus
- **GitHub Issues**: https://github.com/opencampus-sh/opencampus-os/issues
- **Email**: support@opencampus.sh

## 🌟 Acknowledgments

Built by a team of higher education experts, enterprise architects, and open-source contributors.

Special thanks to:
- The Keycloak project
- The Prisma team
- The NestJS community
- The Apache Kafka community

---

**Ready to transform higher education? Join us! 🚀**

[Star on GitHub](https://github.com/opencampus-sh/opencampus-os) | [Join Community](https://discord.gg/opencampus)
