import { Controller, Get, Post, Body, Param, Query, HttpCode } from '@nestjs/common';
import { ComplianceService, ComplianceCheckDto } from '../services/compliance.service';

@Controller('v1/compliance')
export class ComplianceController {
  constructor(private readonly service: ComplianceService) {}

  @Post('check')
  @HttpCode(201)
  async runCheck(@Body() dto: ComplianceCheckDto): Promise<{ status: string; data: any }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const result = await this.service.runComplianceCheck(tenantId, dto);

    return { status: 'success', data: result };
  }

  @Get('status/:standard')
  @HttpCode(200)
  async getStatus(@Param('standard') standard: string): Promise<{ status: string; data: any }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const result = await this.service.getComplianceStatus(tenantId, standard);

    return { status: 'success', data: result };
  }

  @Get('ferpa')
  @HttpCode(200)
  async getFERPAReport(): Promise<{ status: string; data: any }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const result = await this.service.getFERPAReport(tenantId);

    return { status: 'success', data: result };
  }

  @Get('gdpr')
  @HttpCode(200)
  async getGDPRReport(): Promise<{ status: string; data: any }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const result = await this.service.getGDPRReport(tenantId);

    return { status: 'success', data: result };
  }

  @Get('security-assessment')
  @HttpCode(200)
  async getSecurityAssessment(): Promise<{ status: string; data: any }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const result = await this.service.getSecurityAssessment(tenantId);

    return { status: 'success', data: result };
  }

  @Post('breach-report')
  @HttpCode(201)
  async reportBreach(@Body() body: Record<string, any>): Promise<{ status: string; data: any }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const result = await this.service.reportDataBreach(tenantId, body);

    return { status: 'success', data: result };
  }

  @Get('findings')
  @HttpCode(200)
  async listFindings(@Query('standard') standard?: string): Promise<{ status: string; data: any[] }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const findings = await this.service.listComplianceFindings(tenantId, standard);

    return { status: 'success', data: findings };
  }

  @Post('certificate/:standard')
  @HttpCode(201)
  async generateCertificate(@Param('standard') standard: string): Promise<{ status: string; data: any }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const result = await this.service.generateComplianceCertificate(tenantId, standard);

    return { status: 'success', data: result };
  }
}
