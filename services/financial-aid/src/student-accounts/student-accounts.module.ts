import { Module } from '@nestjs/common';
import { StudentAccountRepository } from './repositories/student-account.repository';
import { StudentAccountService } from './services/student-account.service';
import { StudentAccountController } from './controllers/student-account.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [StudentAccountRepository, StudentAccountService],
  controllers: [StudentAccountController],
  exports: [StudentAccountService],
})
export class StudentAccountsModule {}
