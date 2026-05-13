import { Module } from '@nestjs/common';
import { EmployeeService } from './services/employee.service';
import { EmployeeController } from './controllers/employee.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [EmployeeService],
  controllers: [EmployeeController],
  exports: [EmployeeService],
})
export class EmployeeModule {}
