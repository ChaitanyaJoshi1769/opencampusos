import { Controller, Get, Post, Body, Param, Query, HttpCode } from '@nestjs/common';
import { AuditService, LogAuditEventDto } from '../services/audit.service';

@Controller('v1/audit')
export class AuditController {
  constructor(private readonly service: AuditService) {}

  @Post('log')
  @HttpCode(201)
  async logEvent(@Body() dto: LogAuditEventDto): Promise<{ status: string; data: any }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const result = await this.service.logEvent(tenantId, dto);

    return { status: 'success', data: result };
  }

  @Get(':id')
  @HttpCode(200)
  async getLog(@Param('id') id: string): Promise<{ status: string; data: any }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const result = await this.service.getAuditLog(tenantId, id);

    return { status: 'success', data: result };
  }

  @Get()
  @HttpCode(200)
  async listLogs(
    @Query('entityType') entityType?: string,
    @Query('entityId') entityId?: string,
    @Query('action') action?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<{ status: string; data: any[] }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const logs = await this.service.listAuditLogs(
      tenantId,
      entityType,
      entityId,
      action,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
    );

    return { status: 'success', data: logs };
  }

  @Get('user/:userId')
  @HttpCode(200)
  async getUserTrail(@Param('userId') userId: string): Promise<{ status: string; data: any[] }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const logs = await this.service.getUserAuditTrail(tenantId, userId);

    return { status: 'success', data: logs };
  }

  @Get('entity/:entityType/:entityId')
  @HttpCode(200)
  async getEntityHistory(
    @Param('entityType') entityType: string,
    @Param('entityId') entityId: string,
  ): Promise<{ status: string; data: any[] }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const logs = await this.service.getEntityAuditHistory(tenantId, entityType, entityId);

    return { status: 'success', data: logs };
  }

  @Get('search')
  @HttpCode(200)
  async search(@Query('q') query: string): Promise<{ status: string; data: any[] }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const results = await this.service.searchAuditLogs(tenantId, query);

    return { status: 'success', data: results };
  }

  @Get('summary')
  @HttpCode(200)
  async getSummary(@Query('startDate') startDate: string, @Query('endDate') endDate: string): Promise<{ status: string; data: any }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const summary = await this.service.getAuditSummary(tenantId, new Date(startDate), new Date(endDate));

    return { status: 'success', data: summary };
  }

  @Post('export')
  @HttpCode(201)
  async exportLogs(
    @Body() body: { startDate: string; endDate: string; format: 'csv' | 'json' },
  ): Promise<{ status: string; data: any }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const result = await this.service.exportAuditLog(
      tenantId,
      new Date(body.startDate),
      new Date(body.endDate),
      body.format,
    );

    return { status: 'success', data: result };
  }

  @Get('data-access/:dataType')
  @HttpCode(200)
  async getDataAccessLog(@Param('dataType') dataType: string): Promise<{ status: string; data: any[] }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const logs = await this.service.getDataAccessLog(tenantId, dataType);

    return { status: 'success', data: logs };
  }
}
