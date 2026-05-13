import { Module } from '@nestjs/common';
import { GradingService } from './services/grading.service';
import { GradingController } from './controllers/grading.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [GradingService],
  controllers: [GradingController],
  exports: [GradingService],
})
export class GradingModule {}
