import { Module } from '@nestjs/common';
import { PaymentRepository } from './repositories/payment.repository';
import { PaymentService } from './services/payment.service';
import { PaymentController } from './controllers/payment.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { ChargesModule } from '../charges/charges.module';
import { StudentAccountsModule } from '../student-accounts/student-accounts.module';

@Module({
  imports: [PrismaModule, ChargesModule, StudentAccountsModule],
  providers: [PaymentRepository, PaymentService],
  controllers: [PaymentController],
  exports: [PaymentService],
})
export class PaymentsModule {}
