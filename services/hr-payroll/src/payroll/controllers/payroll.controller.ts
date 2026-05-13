import { Controller, Get, Post, Body, Param, Query, Headers } from '@nestjs/common';
import { PayrollService } from '../services/payroll.service';

@Controller('payroll')
export class PayrollController {
  constructor(private payrollService: PayrollService) {}

  @Post()
  async createPayroll(@Body() data: any, @Headers('x-tenant-id') tenantId: string) {
    return this.payrollService.createPayroll(tenantId, data);
  }

  @Get()
  async listPayroll(@Query() filters: any, @Headers('x-tenant-id') tenantId: string) {
    return this.payrollService.listPayroll(tenantId, filters);
  }

  @Get('stats')
  async getStats(@Headers('x-tenant-id') tenantId: string) {
    return this.payrollService.getPayrollStats(tenantId);
  }

  @Post('report')
  async generateReport(
    @Body() body: { payPeriod: string },
    @Headers('x-tenant-id') tenantId: string,
  ) {
    return this.payrollService.generatePayrollReport(tenantId, body.payPeriod);
  }

  @Post('tax-summary')
  async getTaxSummary(
    @Body() body: { payPeriod: string },
    @Headers('x-tenant-id') tenantId: string,
  ) {
    return this.payrollService.getTaxSummary(tenantId, body.payPeriod);
  }

  @Get('employee/:employeeId')
  async getByEmployee(
    @Param('employeeId') employeeId: string,
    @Headers('x-tenant-id') tenantId: string,
  ) {
    return this.payrollService.getPayrollByEmployee(tenantId, employeeId);
  }

  @Get(':id')
  async getPayroll(
    @Param('id') payrollId: string,
    @Headers('x-tenant-id') tenantId: string,
  ) {
    return this.payrollService.getPayroll(tenantId, payrollId);
  }

  @Post(':id/process')
  async processPayroll(
    @Param('id') payrollId: string,
    @Body() body: { approverName: string },
    @Headers('x-tenant-id') tenantId: string,
  ) {
    return this.payrollService.processPayroll(tenantId, payrollId, body.approverName);
  }

  @Post(':id/approve')
  async approvePayroll(
    @Param('id') payrollId: string,
    @Body() body: { approverName: string },
    @Headers('x-tenant-id') tenantId: string,
  ) {
    return this.payrollService.approvePayroll(tenantId, payrollId, body.approverName);
  }
}
