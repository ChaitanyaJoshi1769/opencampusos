# OpenCampusOS

## Project Overview
Building an enterprise-grade, open-source Higher Education Operating System (HEOS) to compete with Ellucian, Workday, and Oracle Campus Solutions.

**Codename:** OpenCampusOS
**Status:** MVP Phase 1 - Foundation
**Vision:** "The modern AI-native operating system for higher education."

## Core Architecture
- Monorepo structure with NestJS microservices
- PostgreSQL + Redis + ClickHouse + Qdrant
- Event-driven with Kafka/NATS
- GraphQL Federation + REST APIs
- Next.js frontends with shadcn/ui
- AI-native (OpenAI, Ollama, LLM integration)
- Kubernetes-native, multi-tenant ready

## Primary Modules (MVP Phase 1)
1. **SIS** - Student Information System
2. **Admissions CRM** - Lead management & application workflows
3. **Auth** - Keycloak + OAuth2 + SAML + CAS
4. **Student Portal** - Course registration, grades, transcripts
5. **Faculty Portal** - Grading, roster, enrollment
6. **AI Copilot** - Campus search, semantic queries, assistant
7. **APIs** - REST + GraphQL + OpenAPI specs
8. **Analytics** - Real-time dashboards & KPIs

## Tech Stack
- **Frontend**: Next.js 15, React, TypeScript, TailwindCSS, shadcn/ui
- **Backend**: NestJS, TypeScript, GraphQL Federation
- **Database**: PostgreSQL, Prisma, Redis, ClickHouse, Qdrant
- **AI**: OpenAI APIs, Ollama, LangChain, pgvector
- **Events**: Kafka
- **Auth**: Keycloak, OAuth2, SAML
- **Infrastructure**: Docker, Kubernetes, Helm, Terraform, ArgoCD
- **Observability**: Prometheus, Grafana, OpenTelemetry, Loki

## Key Design Patterns
- Domain-Driven Design
- CQRS where applicable
- Event Sourcing for audit trails
- Clean Architecture
- Service-to-service gRPC + REST
- API Gateway pattern
- Multi-tenant data isolation

## Development Workflow
```bash
# Install dependencies
pnpm install

# Start dev environment
docker-compose up -d
pnpm dev

# Run tests
pnpm test

# Build for production
pnpm build
```

## Repository Structure
```
apps/              # Next.js & frontend applications
services/          # NestJS microservices
packages/          # Shared libraries & utilities
infrastructure/    # Docker, K8s, Terraform configs
k8s/              # Kubernetes manifests
docs/             # Architecture & API docs
scripts/          # Database seeds, migrations
examples/         # Demo implementations
```

## Important Notes
- All code must be production-ready
- Follow enterprise-grade patterns throughout
- No toy implementations
- Include comprehensive tests
- Document all APIs with OpenAPI/GraphQL schemas
- Security-first (FERPA, GDPR, SOC2, audit trails)
- Multi-tenant isolation by design

## Current Phase
**Phase 1 MVP:** Laying foundational architecture, database schema, core services, and authentication system.
