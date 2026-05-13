import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { HealthModule } from './health/health.module';
import { WorkflowsModule } from './workflows/workflows.module';
import { TasksModule } from './tasks/tasks.module';
import { ApprovalsModule } from './approvals/approvals.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ['.env.local', '.env'] }),
    PrismaModule,
    HealthModule,
    WorkflowsModule,
    TasksModule,
    ApprovalsModule,
  ],
})
export class AppModule {}
