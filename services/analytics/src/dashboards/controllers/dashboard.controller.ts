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
import { DashboardService } from '../services/dashboard.service';

@Controller('dashboards')
export class DashboardController {
  constructor(private dashboardService: DashboardService) {}

  @Post()
  async createDashboard(
    @Headers('x-tenant-id') tenantId: string,
    @Body() body: any,
  ) {
    return this.dashboardService.createDashboard(tenantId, body);
  }

  @Get(':dashboardId')
  async getDashboard(
    @Headers('x-tenant-id') tenantId: string,
    @Param('dashboardId') dashboardId: string,
  ) {
    return this.dashboardService.getDashboard(tenantId, dashboardId);
  }

  @Get()
  async listDashboards(
    @Headers('x-tenant-id') tenantId: string,
    @Query('limit') limit = 10,
    @Query('offset') offset = 0,
  ) {
    return this.dashboardService.listDashboards(tenantId, limit, offset);
  }

  @Patch(':dashboardId')
  async updateDashboard(
    @Headers('x-tenant-id') tenantId: string,
    @Param('dashboardId') dashboardId: string,
    @Body() body: any,
  ) {
    return this.dashboardService.updateDashboard(tenantId, dashboardId, body);
  }

  @Delete(':dashboardId')
  async deleteDashboard(
    @Headers('x-tenant-id') tenantId: string,
    @Param('dashboardId') dashboardId: string,
  ) {
    return this.dashboardService.deleteDashboard(tenantId, dashboardId);
  }

  @Post(':dashboardId/widgets')
  async addWidget(
    @Headers('x-tenant-id') tenantId: string,
    @Param('dashboardId') dashboardId: string,
    @Body() body: any,
  ) {
    return this.dashboardService.addWidget(tenantId, dashboardId, body);
  }

  @Delete('widgets/:widgetId')
  async removeWidget(
    @Headers('x-tenant-id') tenantId: string,
    @Param('widgetId') widgetId: string,
  ) {
    return this.dashboardService.removeWidget(tenantId, widgetId);
  }

  @Get(':dashboardId/report')
  async generateDashboardReport(
    @Headers('x-tenant-id') tenantId: string,
    @Param('dashboardId') dashboardId: string,
  ) {
    return this.dashboardService.generateDashboardReport(tenantId, dashboardId);
  }
}
