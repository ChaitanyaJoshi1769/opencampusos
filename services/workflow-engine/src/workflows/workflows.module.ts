import { Module } from '@nestjs/common';
import { WorkflowService } from './services/workflow.service';
import { WorkflowController } from './controllers/workflow.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [WorkflowService],
  controllers: [WorkflowController],
  exports: [WorkflowService],
})
export class WorkflowsModule {}
