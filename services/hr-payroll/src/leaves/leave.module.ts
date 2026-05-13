import { Module } from '@nestjs/common';
import { LeaveService } from './services/leave.service';
import { LeaveController } from './controllers/leave.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [LeaveService],
  controllers: [LeaveController],
  exports: [LeaveService],
})
export class LeaveModule {}
