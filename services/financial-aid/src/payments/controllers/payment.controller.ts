import { Controller, Get, Post, Patch, Body, Param, Query, HttpCode } from '@nestjs/common';
import { PaymentService, CreatePaymentDto } from '../services/payment.service';
import { Payment } from '@prisma/client';

@Controller('v1/payments')
export class PaymentController {
  constructor(private readonly service: PaymentService) {}

  @Post()
  @HttpCode(201)
  async create(@Body() dto: CreatePaymentDto): Promise<{ status: string; data: Payment }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const payment = await this.service.createPayment(tenantId, dto);

    return { status: 'success', data: payment };
  }

  @Get('account/:accountId')
  @HttpCode(200)
  async getStudentPayments(
    @Param('accountId') accountId: string,
  ): Promise<{ status: string; data: { payments: Payment[]; total: number } }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const result = await this.service.getStudentPayments(tenantId, accountId);

    return { status: 'success', data: result };
  }

  @Get('method/:method')
  @HttpCode(200)
  async getPaymentsByMethod(
    @Param('method') method: string,
  ): Promise<{ status: string; data: Payment[] }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const payments = await this.service.getPaymentsByMethod(tenantId, method);

    return { status: 'success', data: payments };
  }

  @Get('total-received')
  @HttpCode(200)
  async getTotalReceived(): Promise<{ status: string; data: { totalReceived: number } }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const totalReceived = await this.service.getTotalReceived(tenantId);

    return { status: 'success', data: { totalReceived } };
  }

  @Get('date-range')
  @HttpCode(200)
  async getPaymentsInDateRange(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<{ status: string; data: Payment[] }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const payments = await this.service.getPaymentsInDateRange(
      tenantId,
      new Date(startDate),
      new Date(endDate),
    );

    return { status: 'success', data: payments };
  }

  @Get('outstanding')
  @HttpCode(200)
  async getOutstandingPayments(): Promise<{ status: string; data: Payment[] }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const payments = await this.service.getOutstandingPayments(tenantId);

    return { status: 'success', data: payments };
  }

  @Get(':id')
  @HttpCode(200)
  async getPayment(
    @Param('id') id: string,
  ): Promise<{ status: string; data: Payment }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const payment = await this.service.getPayment(tenantId, id);

    return { status: 'success', data: payment };
  }

  @Patch(':id/status')
  @HttpCode(200)
  async updatePaymentStatus(
    @Param('id') id: string,
    @Body() body: { status: 'pending' | 'completed' | 'failed' },
  ): Promise<{ status: string; data: Payment }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const payment = await this.service.updatePaymentStatus(tenantId, id, body.status);

    return { status: 'success', data: payment };
  }

  @Post(':id/refund')
  @HttpCode(200)
  async refundPayment(
    @Param('id') id: string,
    @Body() body: { refundAmount: number },
  ): Promise<{ status: string; data: Payment }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const payment = await this.service.refundPayment(tenantId, id, body.refundAmount);

    return { status: 'success', data: payment };
  }
}
