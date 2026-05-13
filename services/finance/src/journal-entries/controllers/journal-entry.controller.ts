import { Controller, Get, Post, Body, Param, Query, Headers } from '@nestjs/common';
import { JournalEntryService } from '../services/journal-entry.service';

@Controller('journal-entries')
export class JournalEntryController {
  constructor(private journalService: JournalEntryService) {}

  @Post()
  async createEntry(@Body() data: any, @Headers('x-tenant-id') tenantId: string) {
    return this.journalService.createJournalEntry(tenantId, data);
  }

  @Get()
  async listEntries(@Query() filters: any, @Headers('x-tenant-id') tenantId: string) {
    return this.journalService.listJournalEntries(tenantId, filters);
  }

  @Get('stats')
  async getStats(@Headers('x-tenant-id') tenantId: string) {
    return this.journalService.getEntryStats(tenantId);
  }

  @Post('validate')
  async validateBalancing(
    @Body() body: { entries: any[] },
    @Headers('x-tenant-id') tenantId: string,
  ) {
    return this.journalService.validateBalancing(tenantId, body.entries);
  }

  @Get(':id')
  async getEntry(
    @Param('id') entryId: string,
    @Headers('x-tenant-id') tenantId: string,
  ) {
    return this.journalService.getJournalEntry(tenantId, entryId);
  }

  @Post(':id/post')
  async postEntry(
    @Param('id') entryId: string,
    @Headers('x-tenant-id') tenantId: string,
  ) {
    return this.journalService.postJournalEntry(tenantId, entryId);
  }

  @Post(':id/reverse')
  async reverseEntry(
    @Param('id') entryId: string,
    @Headers('x-tenant-id') tenantId: string,
  ) {
    return this.journalService.reverseJournalEntry(tenantId, entryId);
  }

  @Post('range')
  async getEntriesByDateRange(
    @Body() body: { startDate: string; endDate: string },
    @Headers('x-tenant-id') tenantId: string,
  ) {
    return this.journalService.getEntriesByDateRange(
      tenantId,
      new Date(body.startDate),
      new Date(body.endDate),
    );
  }
}
