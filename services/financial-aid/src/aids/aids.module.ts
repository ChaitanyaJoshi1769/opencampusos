import { Module } from '@nestjs/common';
import { AidRepository } from './repositories/aid.repository';
import { AidService } from './services/aid.service';
import { AidController } from './controllers/aid.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { StudentAccountsModule } from '../student-accounts/student-accounts.module';

@Module({
  imports: [PrismaModule, StudentAccountsModule],
  providers: [AidRepository, AidService],
  controllers: [AidController],
  exports: [AidService],
})
export class AidsModule {}
