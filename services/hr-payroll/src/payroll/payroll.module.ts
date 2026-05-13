import { Module } from '@nestjs/common';
import { PayrollService } from './services/payroll.service';
import { PayrollController } from './controllers/payroll.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [PayrollService],
  controllers: [PayrollController],
  exports: [PayrollService],
})
export class PayrollModule {}
