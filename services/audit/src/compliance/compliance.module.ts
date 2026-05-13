import { Module } from '@nestjs/common';
import { ComplianceService } from './services/compliance.service';
import { ComplianceController } from './controllers/compliance.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [ComplianceService],
  controllers: [ComplianceController],
  exports: [ComplianceService],
})
export class ComplianceModule {}
