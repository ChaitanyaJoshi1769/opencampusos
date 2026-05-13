import { Controller, Get, Post, Body, Param, Query, HttpCode } from '@nestjs/common';
import { ReportService, CreateReportTemplateDto } from '../services/report.service';

@Controller('v1/reports')
export class ReportController {
  constructor(private readonly service: ReportService) {}

  @Post('templates')
  @HttpCode(201)
  async createTemplate(@Body() dto: CreateReportTemplateDto): Promise<{ status: string; data: any }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const result = await this.service.createReportTemplate(tenantId, dto);

    return { status: 'success', data: result };
  }

  @Get(':id')
  @HttpCode(200)
  async getReport(@Param('id') id: string): Promise<{ status: string; data: any }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const result = await this.service.getReport(tenantId, id);

    return { status: 'success', data: result };
  }

  @Get()
  @HttpCode(200)
  async listReports(@Query('type') reportType?: string): Promise<{ status: string; data: any[] }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const reports = await this.service.listReports(tenantId, reportType);

    return { status: 'success', data: reports };
  }

  @Post('generate/:templateId')
  @HttpCode(201)
  async generateReport(
    @Param('templateId') templateId: string,
    @Body() body?: { parameters?: Record<string, any> },
  ): Promise<{ status: string; data: any }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const result = await this.service.generateReport(tenantId, templateId, body?.parameters);

    return { status: 'success', data: result };
  }

  @Get('enrollment/:termId')
  @HttpCode(200)
  async getEnrollmentReport(@Param('termId') termId: string): Promise<{ status: string; data: any }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const result = await this.service.getEnrollmentReport(tenantId, termId);

    return { status: 'success', data: result };
  }

  @Get('financial')
  @HttpCode(200)
  async getFinancialReport(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<{ status: string; data: any }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const result = await this.service.getFinancialReport(
      tenantId,
      new Date(startDate),
      new Date(endDate),
    );

    return { status: 'success', data: result };
  }

  @Get('academic/:termId')
  @HttpCode(200)
  async getAcademicReport(@Param('termId') termId: string): Promise<{ status: string; data: any }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const result = await this.service.getAcademicReport(tenantId, termId);

    return { status: 'success', data: result };
  }

  @Get('hr')
  @HttpCode(200)
  async getHRReport(@Query('departmentId') departmentId?: string): Promise<{ status: string; data: any }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const result = await this.service.getHRReport(tenantId, departmentId);

    return { status: 'success', data: result };
  }

  @Post(':templateId/schedule')
  @HttpCode(201)
  async scheduleReport(
    @Param('templateId') templateId: string,
    @Body() body: { frequency: 'daily' | 'weekly' | 'monthly'; recipients?: string[] },
  ): Promise<{ status: string; data: any }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const result = await this.service.scheduleReportGeneration(
      tenantId,
      templateId,
      body.frequency,
      body.recipients,
    );

    return { status: 'success', data: result };
  }

  @Post(':reportId/email')
  @HttpCode(200)
  async emailReport(
    @Param('reportId') reportId: string,
    @Body() body: { recipients: string[] },
  ): Promise<{ status: string; data: any }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const result = await this.service.emailReport(tenantId, reportId, body.recipients);

    return { status: 'success', data: result };
  }
}
