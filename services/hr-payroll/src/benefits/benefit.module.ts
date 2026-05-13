import { Module } from '@nestjs/common';
import { BenefitService } from './services/benefit.service';
import { BenefitController } from './controllers/benefit.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [BenefitService],
  controllers: [BenefitController],
  exports: [BenefitService],
})
export class BenefitModule {}
