import { Module } from '@nestjs/common';
import { ExecutionService } from './services/execution.service';
import { ExecutionController } from './controllers/execution.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [ExecutionService],
  controllers: [ExecutionController],
  exports: [ExecutionService],
})
export class ExecutionsModule {}
