import { Module } from '@nestjs/common';
import { PerformanceService } from './services/performance.service';
import { PerformanceController } from './controllers/performance.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [PerformanceService],
  controllers: [PerformanceController],
  exports: [PerformanceService],
})
export class PerformanceModule {}
