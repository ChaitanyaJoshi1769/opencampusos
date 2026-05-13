import { Controller, Get, Post, Body, Param, Query, HttpCode } from '@nestjs/common';
import { PayrollService, CreatePayPeriodDto, CreatePaycheckDto } from '../services/payroll.service';

@Controller('v1/payroll')
export class PayrollController {
  constructor(private readonly service: PayrollService) {}

  @Post('periods')
  @HttpCode(201)
  async createPayPeriod(@Body() dto: CreatePayPeriodDto): Promise<{ status: string; data: any }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const payPeriod = await this.service.createPayPeriod(tenantId, dto);

    return { status: 'success', data: payPeriod };
  }

  @Get('periods/:id')
  @HttpCode(200)
  async getPayPeriod(@Param('id') id: string): Promise<{ status: string; data: any }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const payPeriod = await this.service.getPayPeriod(tenantId, id);

    return { status: 'success', data: payPeriod };
  }

  @Get('periods')
  @HttpCode(200)
  async listPayPeriods(@Query('status') status?: 'open' | 'closed'): Promise<{ status: string; data: any[] }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const payPeriods = await this.service.listPayPeriods(tenantId, status);

    return { status: 'success', data: payPeriods };
  }

  @Post('paychecks')
  @HttpCode(201)
  async createPaycheck(@Body() dto: CreatePaycheckDto): Promise<{ status: string; data: any }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const paycheck = await this.service.createPaycheck(tenantId, dto);

    return { status: 'success', data: paycheck };
  }

  @Get('paychecks/:id')
  @HttpCode(200)
  async getPaycheck(@Param('id') id: string): Promise<{ status: string; data: any }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const paycheck = await this.service.getPaycheck(tenantId, id);

    return { status: 'success', data: paycheck };
  }

  @Get('paychecks')
  @HttpCode(200)
  async listPaychecks(
    @Query('employeeId') employeeId?: string,
    @Query('payPeriodId') payPeriodId?: string,
  ): Promise<{ status: string; data: any[] }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const paychecks = await this.service.listPaychecks(tenantId, employeeId, payPeriodId);

    return { status: 'success', data: paychecks };
  }

  @Get('summary/:payPeriodId')
  @HttpCode(200)
  async getPayrollSummary(@Param('payPeriodId') payPeriodId: string): Promise<{ status: string; data: any }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const summary = await this.service.calculatePayroll(tenantId, payPeriodId);

    return { status: 'success', data: summary };
  }

  @Post('process/:payPeriodId')
  @HttpCode(200)
  async processPayroll(@Param('payPeriodId') payPeriodId: string): Promise<{ status: string; data: any }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const result = await this.service.processPayroll(tenantId, payPeriodId);

    return { status: 'success', data: result };
  }

  @Get('tax-summary/:employeeId')
  @HttpCode(200)
  async getTaxSummary(@Param('employeeId') employeeId: string, @Query('year') year: number): Promise<{ status: string; data: any }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const summary = await this.service.getTaxSummary(tenantId, employeeId, year);

    return { status: 'success', data: summary };
  }

  @Get('w2/:employeeId')
  @HttpCode(200)
  async generateW2(
    @Param('employeeId') employeeId: string,
    @Query('year') year: number,
  ): Promise<{ status: string; data: any }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const w2 = await this.service.generateW2(tenantId, employeeId, year);

    return { status: 'success', data: w2 };
  }

  @Get('paystub/:paycheckId')
  @HttpCode(200)
  async generatePaystub(@Param('paycheckId') paycheckId: string): Promise<{ status: string; data: any }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const paystub = await this.service.generatePaystub(tenantId, paycheckId);

    return { status: 'success', data: paystub };
  }
}
