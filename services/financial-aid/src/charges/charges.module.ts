import { Module } from '@nestjs/common';
import { ChargeRepository } from './repositories/charge.repository';
import { ChargeService } from './services/charge.service';
import { ChargeController } from './controllers/charge.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { StudentAccountsModule } from '../student-accounts/student-accounts.module';

@Module({
  imports: [PrismaModule, StudentAccountsModule],
  providers: [ChargeRepository, ChargeService],
  controllers: [ChargeController],
  exports: [ChargeService],
})
export class ChargesModule {}
