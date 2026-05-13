import { Controller, Get, HttpCode } from '@nestjs/common';
import { DashboardService } from '../services/dashboard.service';

@Controller('v1/dashboards')
export class DashboardController {
  constructor(private readonly service: DashboardService) {}

  @Get('institution')
  @HttpCode(200)
  async getInstitutionDashboard(): Promise<{ status: string; data: any }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const dashboard = await this.service.getInstitutionDashboard(tenantId);

    return { status: 'success', data: dashboard };
  }

  @Get('student-performance')
  @HttpCode(200)
  async getStudentPerformanceDashboard(): Promise<{ status: string; data: any }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const dashboard = await this.service.getStudentPerformanceDashboard(tenantId);

    return { status: 'success', data: dashboard };
  }

  @Get('admissions')
  @HttpCode(200)
  async getAdmissionsDashboard(): Promise<{ status: string; data: any }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const dashboard = await this.service.getAdmissionsDashboard(tenantId);

    return { status: 'success', data: dashboard };
  }

  @Get('financial')
  @HttpCode(200)
  async getFinancialDashboard(): Promise<{ status: string; data: any }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const dashboard = await this.service.getFinancialDashboard(tenantId);

    return { status: 'success', data: dashboard };
  }

  @Get('hr')
  @HttpCode(200)
  async getHRDashboard(): Promise<{ status: string; data: any }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const dashboard = await this.service.getHRDashboard(tenantId);

    return { status: 'success', data: dashboard };
  }
}
