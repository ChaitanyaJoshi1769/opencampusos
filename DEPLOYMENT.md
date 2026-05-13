# OpenCampusOS Deployment Guide

Complete instructions for deploying OpenCampusOS to production environments.

## Table of Contents
1. [Local Development](#local-development)
2. [Docker Deployment](#docker-deployment)
3. [Kubernetes Deployment](#kubernetes-deployment)
4. [Environment Configuration](#environment-configuration)
5. [Database Setup](#database-setup)
6. [Monitoring & Observability](#monitoring--observability)
7. [Security Hardening](#security-hardening)
8. [Scaling Considerations](#scaling-considerations)

---

## Local Development

### Prerequisites
- Node.js 20.0.0+
- pnpm 9.0.0+
- Docker & Docker Compose
- PostgreSQL 16 (optional with Docker)
- Git

### Quick Start

```bash
# Clone repository
git clone https://github.com/your-org/opencampus-os.git
cd opencampus-os

# Install dependencies
pnpm install

# Start infrastructure
docker-compose up -d

# Initialize database
pnpm run db:migrate
pnpm run db:seed

# Start all services in development mode
pnpm dev
```

### Verification

```bash
# Check all services are running
curl http://localhost:3001/health/services

# View logs
docker-compose logs -f

# Access Grafana
open http://localhost:3000
```

---

## Docker Deployment

### Building Docker Images

```bash
# Build all service images
pnpm run docker:build

# Or build specific service
docker build -t opencampus/sis-service:latest ./services/sis
docker build -t opencampus/financial-aid-service:latest ./services/financial-aid
docker build -t opencampus/admissions-service:latest ./services/admissions
docker build -t opencampus/hr-service:latest ./services/hr
docker build -t opencampus/analytics-service:latest ./services/analytics
docker build -t opencampus/erp-service:latest ./services/erp
docker build -t opencampus/ai-copilot-service:latest ./services/ai-copilot
docker build -t opencampus/api-gateway:latest ./services/api-gateway
docker build -t opencampus/student-portal:latest ./apps/student-portal
```

### Docker Compose Production

Create `docker-compose.prod.yml`:

```yaml
version: '3.9'

services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: opencampus
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: always

  redis:
    image: redis:7-alpine
    restart: always

  api-gateway:
    image: opencampus/api-gateway:latest
    ports:
      - "3001:3001"
    environment:
      DATABASE_URL: postgresql://postgres:${DB_PASSWORD}@postgres:5432/opencampus
      CURRENT_TENANT_ID: default-tenant
      NODE_ENV: production
    depends_on:
      - postgres
    restart: always

  sis-service:
    image: opencampus/sis-service:latest
    environment:
      DATABASE_URL: postgresql://postgres:${DB_PASSWORD}@postgres:5432/opencampus
      PORT: 3002
      NODE_ENV: production
    depends_on:
      - postgres
    restart: always

  financial-aid-service:
    image: opencampus/financial-aid-service:latest
    environment:
      DATABASE_URL: postgresql://postgres:${DB_PASSWORD}@postgres:5432/opencampus
      PORT: 3004
      NODE_ENV: production
    depends_on:
      - postgres
    restart: always

  admissions-service:
    image: opencampus/admissions-service:latest
    environment:
      DATABASE_URL: postgresql://postgres:${DB_PASSWORD}@postgres:5432/opencampus
      PORT: 3003
      NODE_ENV: production
    depends_on:
      - postgres
    restart: always

  hr-service:
    image: opencampus/hr-service:latest
    environment:
      DATABASE_URL: postgresql://postgres:${DB_PASSWORD}@postgres:5432/opencampus
      PORT: 3002
      NODE_ENV: production
    depends_on:
      - postgres
    restart: always

  analytics-service:
    image: opencampus/analytics-service:latest
    environment:
      DATABASE_URL: postgresql://postgres:${DB_PASSWORD}@postgres:5432/opencampus
      PORT: 3003
      NODE_ENV: production
    depends_on:
      - postgres
    restart: always

  erp-service:
    image: opencampus/erp-service:latest
    environment:
      DATABASE_URL: postgresql://postgres:${DB_PASSWORD}@postgres:5432/opencampus
      PORT: 3005
      NODE_ENV: production
    depends_on:
      - postgres
    restart: always

  ai-copilot-service:
    image: opencampus/ai-copilot-service:latest
    environment:
      DATABASE_URL: postgresql://postgres:${DB_PASSWORD}@postgres:5432/opencampus
      PORT: 3006
      NODE_ENV: production
      OPENAI_API_KEY: ${OPENAI_API_KEY}
    depends_on:
      - postgres
    restart: always

  student-portal:
    image: opencampus/student-portal:latest
    ports:
      - "3010:3010"
    environment:
      NEXT_PUBLIC_API_URL: https://api.opencampus.edu
      NODE_ENV: production
    restart: always

volumes:
  postgres_data:
```

Deploy:

```bash
docker-compose -f docker-compose.prod.yml up -d
```

---

## Kubernetes Deployment

### Prerequisites
- Kubernetes 1.24+
- kubectl configured
- Docker images pushed to registry
- PostgreSQL external database (Cloud SQL, RDS, etc.)

### Namespace Setup

```bash
kubectl create namespace opencampus
kubectl config set-context --current --namespace=opencampus
```

### ConfigMaps and Secrets

```bash
# Create secrets
kubectl create secret generic opencampus-db \
  --from-literal=url="postgresql://user:pass@postgres.example.com:5432/opencampus" \
  -n opencampus

kubectl create secret generic opencampus-ai \
  --from-literal=openai-key="sk-..." \
  -n opencampus

# Create configmaps
kubectl create configmap opencampus-config \
  --from-literal=environment=production \
  --from-literal=log-level=info \
  -n opencampus
```

### Deploy Services

```bash
# Apply all Kubernetes manifests
kubectl apply -f k8s/ -n opencampus

# Monitor rollout
kubectl rollout status deployment/api-gateway -n opencampus
kubectl rollout status deployment/sis-service -n opencampus
kubectl rollout status deployment/financial-aid-service -n opencampus
kubectl rollout status deployment/admissions-service -n opencampus
kubectl rollout status deployment/hr-service -n opencampus
kubectl rollout status deployment/analytics-service -n opencampus
kubectl rollout status deployment/erp-service -n opencampus
kubectl rollout status deployment/ai-copilot-service -n opencampus
```

### Service Exposure

```bash
# Expose API Gateway
kubectl expose deployment/api-gateway \
  --type=LoadBalancer \
  --port=80 \
  --target-port=3001 \
  -n opencampus

# Get LoadBalancer IP
kubectl get svc api-gateway -n opencampus
```

---

## Environment Configuration

### Required Environment Variables

```bash
# Database
DATABASE_URL=postgresql://user:password@host:5432/opencampus

# Tenancy
CURRENT_TENANT_ID=default-tenant

# API Configuration
API_PORT=3001
API_CORS_ORIGIN=https://app.opencampus.edu

# Authentication
JWT_SECRET=your-secret-key
JWT_EXPIRATION=24h
KEYCLOAK_URL=https://auth.opencampus.edu
KEYCLOAK_REALM=opencampus

# AI Integration
OPENAI_API_KEY=sk-...
QDRANT_URL=http://qdrant:6333

# Monitoring
LOG_LEVEL=info
PROMETHEUS_ENABLED=true
JAEGER_ENABLED=true
JAEGER_ENDPOINT=http://jaeger:14268/api/traces

# Email (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=noreply@opencampus.edu
SMTP_PASSWORD=app-password
```

### Feature Flags

```bash
# Feature toggles
FEATURE_FINANCIAL_AID=true
FEATURE_HR_MODULE=true
FEATURE_ANALYTICS=true
FEATURE_AI_COPILOT=true
FEATURE_ERP=true
```

---

## Database Setup

### Initial Setup

```bash
# Create database
createdb opencampus

# Run migrations
pnpm run db:migrate

# Seed test data
pnpm run db:seed

# Verify schema
psql opencampus -c "\dt"
```

### Backup & Recovery

```bash
# Backup database
pg_dump opencampus > backup.sql

# Restore from backup
psql opencampus < backup.sql

# Automated backups with cron
0 2 * * * /usr/bin/pg_dump opencampus | gzip > /backups/opencampus-$(date +\%Y\%m\%d).sql.gz
```

### Database Optimization

```bash
# Analyze query performance
ANALYZE;

# Reindex tables
REINDEX DATABASE opencampus;

# Vacuum and analyze
VACUUM ANALYZE;
```

---

## Monitoring & Observability

### Prometheus

Access at http://prometheus:9090

Configured scrape targets:
- api-gateway:3001/metrics
- sis-service:3002/metrics
- financial-aid-service:3004/metrics
- admissions-service:3003/metrics
- hr-service:3002/metrics
- analytics-service:3003/metrics
- erp-service:3005/metrics
- ai-copilot-service:3006/metrics

### Grafana

Access at http://grafana:3000

Predefined dashboards:
- System Overview
- API Gateway Metrics
- Service Health
- Database Performance
- Error Rates

### Loki (Log Aggregation)

```bash
# View logs
loki-logql logs from service="sis-service"
```

### Jaeger (Distributed Tracing)

Access at http://jaeger:16686

---

## Security Hardening

### Network Security

```bash
# Implement network policies
kubectl apply -f k8s/network-policy.yaml

# Enable TLS
kubectl apply -f k8s/certificate.yaml
```

### RBAC Configuration

```bash
# Create service accounts
kubectl apply -f k8s/service-accounts.yaml

# Apply role bindings
kubectl apply -f k8s/rbac.yaml
```

### Secrets Management

```bash
# Use sealed secrets
kubectl apply -f https://github.com/bitnami-labs/sealed-secrets/releases/download/v0.24.0/controller.yaml

# Seal secrets
kubeseal -f secret.yaml -w sealed-secret.yaml
```

### Certificate Management

```bash
# Install cert-manager
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.0/cert-manager.yaml

# Create Let's Encrypt issuer
kubectl apply -f k8s/letsencrypt-issuer.yaml
```

---

## Scaling Considerations

### Horizontal Scaling

```bash
# Scale deployment
kubectl scale deployment/sis-service --replicas=3 -n opencampus

# Autoscaling
kubectl apply -f k8s/autoscaling.yaml

# Check autoscaler status
kubectl describe hpa -n opencampus
```

### Vertical Scaling

Update resource requests/limits in deployment YAML:

```yaml
resources:
  requests:
    memory: "512Mi"
    cpu: "500m"
  limits:
    memory: "1Gi"
    cpu: "1000m"
```

### Database Scaling

For high volume:
1. Enable read replicas
2. Implement connection pooling (PgBouncer)
3. Use sharding for tenant data isolation
4. Consider managed database services

---

## Troubleshooting

### Service Won't Start

```bash
# Check logs
kubectl logs deployment/sis-service -n opencampus

# Describe pod
kubectl describe pod <pod-name> -n opencampus

# Check events
kubectl get events -n opencampus --sort-by='.lastTimestamp'
```

### Database Connection Issues

```bash
# Test connection
psql postgresql://user:password@host:5432/opencampus

# Check connection pool
SELECT * FROM pg_stat_activity;
```

### Performance Issues

```bash
# Check slow queries
SELECT * FROM pg_stat_statements;

# Monitor resource usage
kubectl top pods -n opencampus
kubectl top nodes
```

---

## Maintenance

### Regular Tasks

- Weekly: Review logs and alerts
- Monthly: Test backup/recovery
- Quarterly: Review and optimize database
- Annually: Security audit and penetration testing

### Update Procedure

1. Update code and test locally
2. Build new Docker images
3. Push images to registry
4. Update Kubernetes manifests
5. Rolling update deployment
6. Monitor health and metrics
7. Rollback if needed

```bash
kubectl set image deployment/sis-service \
  sis-service=opencampus/sis-service:v1.1.0 \
  -n opencampus \
  --record
```

---

## Support & Help

For deployment issues:
1. Check [GitHub Issues](https://github.com/opencampus-sh/opencampus-os/issues)
2. Review logs and monitoring dashboards
3. Consult documentation in `/docs`
4. Post in community forum
