import { Controller, Get, Post, Body, Param, Query, HttpCode } from '@nestjs/common';
import { JournalEntryService, CreateJournalEntryDto } from '../services/journal-entry.service';

@Controller('v1/journal-entries')
export class JournalEntryController {
  constructor(private readonly service: JournalEntryService) {}

  @Post()
  @HttpCode(201)
  async create(@Body() dto: CreateJournalEntryDto): Promise<{ status: string; data: any }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const entry = await this.service.createJournalEntry(tenantId, dto);

    return { status: 'success', data: entry };
  }

  @Get('trial-balance')
  @HttpCode(200)
  async getTrialBalance(
    @Query('asOfDate') asOfDate?: string,
  ): Promise<{ status: string; data: any }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const trialBalance = await this.service.getTrialBalance(
      tenantId,
      asOfDate ? new Date(asOfDate) : undefined,
    );

    return { status: 'success', data: trialBalance };
  }

  @Get('ledger/:accountCode')
  @HttpCode(200)
  async getGeneralLedger(
    @Param('accountCode') accountCode: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<{ status: string; data: any }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const ledger = await this.service.getGeneralLedger(
      tenantId,
      accountCode,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
    );

    return { status: 'success', data: ledger };
  }
}
