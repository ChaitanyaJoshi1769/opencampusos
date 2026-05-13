import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { EmployeeModule } from '../employees/employee.module';

@Module({
  imports: [PrismaModule, EmployeeModule],
})
export class PayrollModule {}
