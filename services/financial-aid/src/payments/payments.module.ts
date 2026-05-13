import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { StudentAccountsModule } from '../student-accounts/student-accounts.module';

@Module({
  imports: [PrismaModule, StudentAccountsModule],
})
export class PaymentsModule {}
