import { Module } from '@nestjs/common';
import { UtilizationService } from './services/utilization.service';
import { UtilizationController } from './controllers/utilization.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [UtilizationService],
  controllers: [UtilizationController],
  exports: [UtilizationService],
})
export class UtilizationModule {}
