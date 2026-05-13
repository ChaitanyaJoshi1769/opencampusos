import { Controller, Get, Post, Delete, Body, Param, Query, HttpCode } from '@nestjs/common';
import { ExportService, ExportRequestDto } from '../services/export.service';

@Controller('v1/exports')
export class ExportController {
  constructor(private readonly service: ExportService) {}

  @Post('request')
  @HttpCode(201)
  async requestExport(@Body() dto: ExportRequestDto): Promise<{ status: string; data: any }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const result = await this.service.requestExport(tenantId, dto);

    return { status: 'success', data: result };
  }

  @Get(':id/status')
  @HttpCode(200)
  async getStatus(@Param('id') id: string): Promise<{ status: string; data: any }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const result = await this.service.getExportStatus(tenantId, id);

    return { status: 'success', data: result };
  }

  @Get()
  @HttpCode(200)
  async list(@Query('status') status?: string): Promise<{ status: string; data: any[] }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const exports = await this.service.listExports(tenantId, status);

    return { status: 'success', data: exports };
  }

  @Delete(':id')
  @HttpCode(200)
  async cancel(@Param('id') id: string): Promise<{ status: string; message: string }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    await this.service.cancelExport(tenantId, id);

    return { status: 'success', message: 'Export cancelled successfully' };
  }

  @Post('preview')
  @HttpCode(200)
  async getPreview(@Body() dto: ExportRequestDto): Promise<{ status: string; data: any }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const result = await this.service.generatePreview(tenantId, dto);

    return { status: 'success', data: result };
  }

  @Post('schedule')
  @HttpCode(201)
  async scheduleExport(
    @Body() body: { exportRequest: ExportRequestDto; frequency: 'daily' | 'weekly' | 'monthly' },
  ): Promise<{ status: string; data: any }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const result = await this.service.scheduleExport(tenantId, body.exportRequest, body.frequency);

    return { status: 'success', data: result };
  }

  @Post('bulk')
  @HttpCode(201)
  async bulkExport(@Body() body: { exports: ExportRequestDto[] }): Promise<{ status: string; data: any }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const result = await this.service.bulkExport(tenantId, body.exports);

    return { status: 'success', data: result };
  }
}
