import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { HealthModule } from './health/health.module';
import { AuditModule } from './audit/audit.module';
import { ComplianceModule } from './compliance/compliance.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ['.env.local', '.env'] }),
    PrismaModule,
    HealthModule,
    AuditModule,
    ComplianceModule,
  ],
})
export class AppModule {}
