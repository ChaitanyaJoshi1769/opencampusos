import { Module } from '@nestjs/common';
import { ApprovalService } from './services/approval.service';
import { ApprovalController } from './controllers/approval.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [ApprovalService],
  controllers: [ApprovalController],
})
export class ApprovalsModule {}
