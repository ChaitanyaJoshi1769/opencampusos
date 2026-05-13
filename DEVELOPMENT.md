# OpenCampusOS Development Guide

Guidelines for developing services and features in OpenCampusOS.

## Architecture Principles

### 1. Service Design
Each microservice follows a consistent pattern:
```
services/{service-name}/
├── src/
│   ├── main.ts              # Bootstrap
│   ├── app.module.ts        # Root module
│   ├── prisma/              # Database layer
│   │   ├── prisma.module.ts
│   │   └── prisma.service.ts
│   ├── health/              # Health checks
│   │   ├── health.module.ts
│   │   └── health.controller.ts
│   └── {feature}/           # Feature modules
│       ├── {feature}.module.ts
│       ├── services/        # Business logic
│       │   └── {feature}.service.ts
│       └── controllers/     # API endpoints
│           └── {feature}.controller.ts
├── prisma/
│   └── schema.prisma        # Data model
├── package.json
├── tsconfig.json
└── .env.example
```

### 2. Multi-Tenancy
- Every request includes X-Tenant-ID header
- All queries filtered by tenantId
- Row-Level Security (RLS) enforces isolation
- Use PrismaService for data access

### 3. API Design
- REST endpoints on /resource routes
- GraphQL schemas for federation
- Consistent error handling
- Input validation with class-validator
- Health checks: /health, /health/live, /health/ready

## Development Workflow

### Creating a New Service

1. **Scaffold service**
```bash
mkdir -p services/my-service/src/{my-feature,health,prisma}
cd services/my-service
```

2. **Initialize package.json**
```json
{
  "name": "my-service",
  "version": "1.0.0",
  "main": "src/main.ts",
  "scripts": {
    "dev": "nest start --watch",
    "build": "nest build",
    "start": "node dist/main"
  },
  "dependencies": {
    "@nestjs/common": "^10.0.0",
    "@nestjs/core": "^10.0.0",
    "@prisma/client": "^5.0.0"
  }
}
```

3. **Create main.ts**
```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: '*' });
  await app.listen(process.env.PORT || 3032);
}
bootstrap();
```

4. **Create app.module.ts**
```typescript
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { HealthModule } from './health/health.module';
import { MyFeatureModule } from './my-feature/my-feature.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PrismaModule,
    HealthModule,
    MyFeatureModule,
  ],
})
export class AppModule {}
```

5. **Implement Prisma service**
```typescript
// prisma/prisma.service.ts
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
```

### Creating a Feature Module

1. **Service (Business Logic)**
```typescript
// my-feature/services/my-feature.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MyFeatureService {
  constructor(private prisma: PrismaService) {}

  async create(tenantId: string, data: any) {
    return this.prisma.myModel.create({
      data: { ...data, tenantId },
    });
  }

  async list(tenantId: string) {
    return this.prisma.myModel.findMany({
      where: { tenantId },
    });
  }
}
```

2. **Controller (API Endpoints)**
```typescript
// my-feature/controllers/my-feature.controller.ts
import { Controller, Get, Post, Body, Headers } from '@nestjs/common';
import { MyFeatureService } from '../services/my-feature.service';

@Controller('my-feature')
export class MyFeatureController {
  constructor(private service: MyFeatureService) {}

  @Post()
  async create(
    @Body() data: any,
    @Headers('x-tenant-id') tenantId: string,
  ) {
    return this.service.create(tenantId, data);
  }

  @Get()
  async list(@Headers('x-tenant-id') tenantId: string) {
    return this.service.list(tenantId);
  }
}
```

3. **Module**
```typescript
// my-feature/my-feature.module.ts
import { Module } from '@nestjs/common';
import { MyFeatureService } from './services/my-feature.service';
import { MyFeatureController } from './controllers/my-feature.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [MyFeatureService],
  controllers: [MyFeatureController],
})
export class MyFeatureModule {}
```

4. **Database Schema**
```prisma
// prisma/schema.prisma
model MyModel {
  id        String   @id @default(cuid())
  tenantId  String
  name      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([tenantId])
}
```

## Code Standards

### TypeScript
- Strict mode enabled
- ES2021 target
- No `any` types without justification
- Explicit return types on functions

### NestJS
- Injectable dependencies
- Guard authentication with roles
- Validate inputs with DTOs
- Use proper HTTP status codes

### Database
- Always include tenantId in queries
- Use include for relationships
- Index frequently queried fields
- Soft deletes where applicable

### Error Handling
```typescript
import { HttpException, HttpStatus } from '@nestjs/common';

throw new HttpException(
  'Resource not found',
  HttpStatus.NOT_FOUND
);
```

### Logging
```typescript
import { Logger } from '@nestjs/common';

export class MyService {
  private logger = new Logger(MyService.name);

  doSomething() {
    this.logger.debug('Starting operation');
    this.logger.error('Error occurred', error.stack);
  }
}
```

## Testing

### Unit Tests
```typescript
// my-feature.service.spec.ts
import { Test } from '@nestjs/testing';
import { MyFeatureService } from './my-feature.service';

describe('MyFeatureService', () => {
  let service: MyFeatureService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [MyFeatureService],
    }).compile();

    service = module.get<MyFeatureService>(MyFeatureService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
```

## Git Workflow

### Branch Naming
- Feature: `feature/description`
- Bug: `fix/description`
- Docs: `docs/description`

### Commits
```
feat: add new feature
fix: fix bug in service
docs: update README
refactor: reorganize code structure
test: add unit tests
```

### Pull Request
1. Fork repository
2. Create feature branch
3. Commit changes
4. Push to fork
5. Create PR with description
6. Await review & merge

## Environment Variables

Example `.env.example`:
```
PORT=3032
NODE_ENV=development
CORS_ORIGIN=*
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/opencampusos
CURRENT_TENANT_ID=default-tenant
LOG_LEVEL=debug
```

## Running Services Locally

```bash
# Install dependencies
pnpm install

# Start infrastructure
docker-compose up -d

# Run migrations
pnpm run prisma:migrate

# Start all services
pnpm dev

# Start specific service
pnpm --filter services/my-service dev
```

## Deployment

### Docker Build
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN pnpm install --prod
COPY dist .
EXPOSE 3032
CMD ["node", "dist/main.js"]
```

### Kubernetes
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-service
spec:
  replicas: 2
  selector:
    matchLabels:
      app: my-service
  template:
    metadata:
      labels:
        app: my-service
    spec:
      containers:
      - name: my-service
        image: opencampusos/my-service:latest
        ports:
        - containerPort: 3032
        livenessProbe:
          httpGet:
            path: /health/live
            port: 3032
          initialDelaySeconds: 30
          periodSeconds: 10
```

## Common Commands

```bash
# Database
pnpm run prisma:generate    # Generate Prisma client
pnpm run prisma:migrate     # Run migrations
pnpm run prisma:seed        # Seed data
pnpm run prisma:studio      # Visual editor

# Development
pnpm dev                    # All services
pnpm dev --filter services/my-service  # Single service
pnpm test                   # Run tests
pnpm lint                   # Lint code

# Docker
docker-compose up -d        # Start services
docker-compose down         # Stop services
docker-compose logs -f      # View logs
```

## Best Practices

1. **Single Responsibility** - Each service handles one domain
2. **Error Handling** - Catch and properly respond to errors
3. **Logging** - Log important operations and errors
4. **Documentation** - Document complex logic and APIs
5. **Testing** - Write unit tests for critical paths
6. **Performance** - Index databases, cache responses
7. **Security** - Validate inputs, enforce authentication
8. **Scalability** - Design for horizontal scaling

## Resources

- [NestJS Documentation](https://docs.nestjs.com)
- [Prisma Documentation](https://www.prisma.io/docs)
- [GraphQL Federation](https://www.apollographql.com/docs/federation)
- [Kubernetes Docs](https://kubernetes.io/docs)
