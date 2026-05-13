import { Controller, Get, Post, Body, Param, Query, Headers } from '@nestjs/common';
import { ScheduleService } from '../services/schedule.service';

@Controller('schedule')
export class ScheduleController {
  constructor(private scheduleService: ScheduleService) {}

  @Get('term/:academicTerm')
  async getTermSchedule(
    @Param('academicTerm') academicTerm: string,
    @Headers('x-tenant-id') tenantId: string,
  ) {
    return this.scheduleService.getTermSchedule(tenantId, academicTerm);
  }

  @Post('term/:academicTerm/publish')
  async publishSchedule(
    @Param('academicTerm') academicTerm: string,
    @Headers('x-tenant-id') tenantId: string,
  ) {
    return this.scheduleService.publishSchedule(tenantId, academicTerm);
  }

  @Get('week')
  async getWeeklySchedule(
    @Query('startDate') startDate: string,
    @Headers('x-tenant-id') tenantId: string,
  ) {
    return this.scheduleService.getWeeklySchedule(tenantId, new Date(startDate));
  }

  @Get('day')
  async getDaySchedule(
    @Query('date') date: string,
    @Headers('x-tenant-id') tenantId: string,
  ) {
    return this.scheduleService.getDaySchedule(tenantId, new Date(date));
  }

  @Get('conflicts')
  async getConflicts(@Headers('x-tenant-id') tenantId: string) {
    return this.scheduleService.getConflictingSchedules(tenantId);
  }

  @Get('insights')
  async getInsights(@Headers('x-tenant-id') tenantId: string) {
    return this.scheduleService.generateScheduleInsights(tenantId);
  }

  @Get('export')
  async exportSchedule(
    @Query('academicTerm') academicTerm: string,
    @Query('format') format?: string,
    @Headers('x-tenant-id') tenantId?: string,
  ) {
    return this.scheduleService.exportSchedule(tenantId, academicTerm, format || 'json');
  }
}
