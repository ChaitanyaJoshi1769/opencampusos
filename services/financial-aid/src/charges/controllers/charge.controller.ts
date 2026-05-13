import { Controller, Get, Post, Patch, Body, Param, HttpCode } from '@nestjs/common';
import { ChargeService, CreateChargeDto } from '../services/charge.service';
import { Charge } from '@prisma/client';

@Controller('v1/charges')
export class ChargeController {
  constructor(private readonly service: ChargeService) {}

  @Post()
  @HttpCode(201)
  async create(@Body() dto: CreateChargeDto): Promise<{ status: string; data: Charge }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const charge = await this.service.createCharge(tenantId, {
      ...dto,
      chargeDate: new Date(dto.chargeDate),
      dueDate: new Date(dto.dueDate),
    });

    return { status: 'success', data: charge };
  }

  @Get('account/:accountId')
  @HttpCode(200)
  async getAccountCharges(
    @Param('accountId') accountId: string,
  ): Promise<{ status: string; data: { charges: Charge[]; total: number } }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const result = await this.service.getStudentCharges(tenantId, accountId);

    return { status: 'success', data: result };
  }

  @Get('account/:accountId/open')
  @HttpCode(200)
  async getOpenCharges(
    @Param('accountId') accountId: string,
  ): Promise<{ status: string; data: Charge[] }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const charges = await this.service.getOpenCharges(tenantId, accountId);

    return { status: 'success', data: charges };
  }

  @Get('account/:accountId/total-due')
  @HttpCode(200)
  async getTotalDue(
    @Param('accountId') accountId: string,
  ): Promise<{ status: string; data: { totalDue: number } }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const totalDue = await this.service.getTotalDue(tenantId, accountId);

    return { status: 'success', data: { totalDue } };
  }

  @Get('overdue')
  @HttpCode(200)
  async getOverdueCharges(): Promise<{ status: string; data: Charge[] }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const charges = await this.service.getOverdueCharges(tenantId);

    return { status: 'success', data: charges };
  }

  @Get(':id')
  @HttpCode(200)
  async getCharge(
    @Param('id') id: string,
  ): Promise<{ status: string; data: Charge }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const charge = await this.service.getCharge(tenantId, id);

    return { status: 'success', data: charge };
  }

  @Patch(':id/pay')
  @HttpCode(200)
  async markPaid(
    @Param('id') id: string,
  ): Promise<{ status: string; data: Charge }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const charge = await this.service.markChargePaid(tenantId, id);

    return { status: 'success', data: charge };
  }
}
