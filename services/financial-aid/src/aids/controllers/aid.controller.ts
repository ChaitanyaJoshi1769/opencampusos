import { Controller, Get, Post, Patch, Body, Param, HttpCode } from '@nestjs/common';
import { AidService, CreateAidDto } from '../services/aid.service';
import { FinancialAidAward } from '@prisma/client';

@Controller('v1/financial-aid')
export class AidController {
  constructor(private readonly service: AidService) {}

  @Post()
  @HttpCode(201)
  async createAward(@Body() dto: CreateAidDto): Promise<{ status: string; data: FinancialAidAward }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const award = await this.service.createAward(tenantId, dto);

    return { status: 'success', data: award };
  }

  @Get('account/:accountId')
  @HttpCode(200)
  async getStudentAwards(
    @Param('accountId') accountId: string,
  ): Promise<{ status: string; data: { awards: FinancialAidAward[]; total: number } }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const result = await this.service.getStudentAwards(tenantId, accountId);

    return { status: 'success', data: result };
  }

  @Get('type/:awardType')
  @HttpCode(200)
  async getAwardsByType(
    @Param('awardType') awardType: string,
  ): Promise<{ status: string; data: FinancialAidAward[] }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const awards = await this.service.getAwardsByType(tenantId, awardType);

    return { status: 'success', data: awards };
  }

  @Get('status/:status')
  @HttpCode(200)
  async getAwardsByStatus(
    @Param('status') status: string,
  ): Promise<{ status: string; data: FinancialAidAward[] }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const awards = await this.service.getAwardsByStatus(tenantId, status);

    return { status: 'success', data: awards };
  }

  @Get('total-awarded')
  @HttpCode(200)
  async getTotalAwarded(): Promise<{ status: string; data: { totalAwarded: number } }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const totalAwarded = await this.service.getTotalAwarded(tenantId);

    return { status: 'success', data: { totalAwarded } };
  }

  @Get('total-awarded/:awardType')
  @HttpCode(200)
  async getTotalAwardedByType(
    @Param('awardType') awardType: string,
  ): Promise<{ status: string; data: { totalAwarded: number } }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const totalAwarded = await this.service.getTotalAwardedByType(tenantId, awardType);

    return { status: 'success', data: { totalAwarded } };
  }

  @Get('account/:accountId/total')
  @HttpCode(200)
  async getStudentTotalAwarded(
    @Param('accountId') accountId: string,
  ): Promise<{ status: string; data: { totalAwarded: number } }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const totalAwarded = await this.service.getStudentTotalAwarded(tenantId, accountId);

    return { status: 'success', data: { totalAwarded } };
  }

  @Get('pending-disbursement')
  @HttpCode(200)
  async getAwaitingDisbursement(): Promise<{ status: string; data: FinancialAidAward[] }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const awards = await this.service.getAwaitingDisbursement(tenantId);

    return { status: 'success', data: awards };
  }

  @Get(':id')
  @HttpCode(200)
  async getAward(
    @Param('id') id: string,
  ): Promise<{ status: string; data: FinancialAidAward }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const award = await this.service.getAward(tenantId, id);

    return { status: 'success', data: award };
  }

  @Patch(':id/status')
  @HttpCode(200)
  async updateAwardStatus(
    @Param('id') id: string,
    @Body() body: { status: 'active' | 'pending' | 'declined' | 'cancelled' },
  ): Promise<{ status: string; data: FinancialAidAward }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const award = await this.service.updateAwardStatus(tenantId, id, body.status);

    return { status: 'success', data: award };
  }

  @Post(':id/disburse')
  @HttpCode(200)
  async recordDisbursement(
    @Param('id') id: string,
    @Body() body: { disbursementDate: string },
  ): Promise<{ status: string; data: FinancialAidAward }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const award = await this.service.recordDisbursement(
      tenantId,
      id,
      new Date(body.disbursementDate),
    );

    return { status: 'success', data: award };
  }
}
