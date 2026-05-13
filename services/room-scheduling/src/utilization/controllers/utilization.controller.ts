import { Controller, Get, Post, Body, Param, Query, Headers } from '@nestjs/common';
import { UtilizationService } from '../services/utilization.service';

@Controller('utilization')
export class UtilizationController {
  constructor(private utilizationService: UtilizationService) {}

  @Post('record')
  async recordUtilization(
    @Body() body: { roomId: string; occupancy: number },
    @Headers('x-tenant-id') tenantId: string,
  ) {
    return this.utilizationService.recordUtilization(tenantId, body.roomId, body.occupancy);
  }

  @Get('room/:roomId')
  async getRoomUtilization(
    @Param('roomId') roomId: string,
    @Query('days') days?: string,
    @Headers('x-tenant-id') tenantId?: string,
  ) {
    return this.utilizationService.getRoomUtilization(tenantId, roomId, days ? parseInt(days) : 7);
  }

  @Get('room/:roomId/average')
  async getAverageUtilization(
    @Param('roomId') roomId: string,
    @Query('days') days?: string,
    @Headers('x-tenant-id') tenantId?: string,
  ) {
    return this.utilizationService.getAverageUtilization(tenantId, roomId, days ? parseInt(days) : 30);
  }

  @Get('room/:roomId/trend')
  async getUtilizationTrend(
    @Param('roomId') roomId: string,
    @Query('days') days?: string,
    @Headers('x-tenant-id') tenantId?: string,
  ) {
    return this.utilizationService.getUtilizationTrend(tenantId, roomId, days ? parseInt(days) : 30);
  }

  @Get('building/:building')
  async getBuildingUtilization(
    @Param('building') building: string,
    @Headers('x-tenant-id') tenantId: string,
  ) {
    return this.utilizationService.getBuildingUtilization(tenantId, building);
  }

  @Get('underutilized')
  async getUnderutilizedRooms(
    @Query('threshold') threshold?: string,
    @Headers('x-tenant-id') tenantId?: string,
  ) {
    return this.utilizationService.getUnderutilizedRooms(tenantId, threshold ? parseInt(threshold) : 30);
  }

  @Post('report')
  async generateReport(
    @Body() body: { startDate: string; endDate: string },
    @Headers('x-tenant-id') tenantId: string,
  ) {
    return this.utilizationService.generateUtilizationReport(
      tenantId,
      new Date(body.startDate),
      new Date(body.endDate),
    );
  }
}
