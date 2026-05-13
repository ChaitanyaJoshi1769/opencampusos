import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Headers,
  Query,
} from '@nestjs/common';
import { KpiService } from '../services/kpi.service';

@Controller('kpis')
export class KpiController {
  constructor(private kpiService: KpiService) {}

  @Post()
  async createKpi(
    @Headers('x-tenant-id') tenantId: string,
    @Body() body: any,
  ) {
    return this.kpiService.createKpi(tenantId, body);
  }

  @Get(':kpiId')
  async getKpi(
    @Headers('x-tenant-id') tenantId: string,
    @Param('kpiId') kpiId: string,
  ) {
    return this.kpiService.getKpi(tenantId, kpiId);
  }

  @Get()
  async listKpis(
    @Headers('x-tenant-id') tenantId: string,
    @Query('category') category?: string,
  ) {
    return this.kpiService.listKpis(tenantId, category);
  }

  @Patch(':kpiId')
  async updateKpi(
    @Headers('x-tenant-id') tenantId: string,
    @Param('kpiId') kpiId: string,
    @Body() body: any,
  ) {
    return this.kpiService.updateKpi(tenantId, kpiId, body);
  }

  @Delete(':kpiId')
  async deleteKpi(
    @Headers('x-tenant-id') tenantId: string,
    @Param('kpiId') kpiId: string,
  ) {
    return this.kpiService.deleteKpi(tenantId, kpiId);
  }

  @Get(':kpiId/calculate')
  async calculateKpi(
    @Headers('x-tenant-id') tenantId: string,
    @Param('kpiId') kpiId: string,
    @Query('formula') formula?: string,
  ) {
    return this.kpiService.calculateKpi(tenantId, kpiId, formula);
  }

  @Get(':kpiId/trend')
  async getKpiTrend(
    @Headers('x-tenant-id') tenantId: string,
    @Param('kpiId') kpiId: string,
    @Query('days') days: number = 30,
  ) {
    return this.kpiService.getKpiTrend(tenantId, kpiId, days);
  }

  @Post('compare')
  async compareKpis(
    @Headers('x-tenant-id') tenantId: string,
    @Body() body: { kpiIds: string[] },
  ) {
    return this.kpiService.compareKpis(tenantId, body.kpiIds);
  }

  @Get('category/:category')
  async getKpisByCategory(
    @Headers('x-tenant-id') tenantId: string,
    @Param('category') category: string,
  ) {
    return this.kpiService.getKpisByCategory(tenantId, category);
  }
}
