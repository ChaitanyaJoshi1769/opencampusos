import { Controller, Get, Post, Put, Body, Param, Query, Headers } from '@nestjs/common';
import { PerformanceService } from '../services/performance.service';

@Controller('performance')
export class PerformanceController {
  constructor(private performanceService: PerformanceService) {}

  @Post()
  async createReview(@Body() data: any, @Headers('x-tenant-id') tenantId: string) {
    return this.performanceService.createReview(tenantId, data);
  }

  @Get()
  async listReviews(@Query() filters: any, @Headers('x-tenant-id') tenantId: string) {
    return this.performanceService.listReviews(tenantId, filters);
  }

  @Get('stats')
  async getStats(@Headers('x-tenant-id') tenantId: string) {
    return this.performanceService.getPerformanceStats(tenantId);
  }

  @Get('employee/:employeeId/average')
  async getAverageRating(
    @Param('employeeId') employeeId: string,
    @Headers('x-tenant-id') tenantId: string,
  ) {
    return this.performanceService.getAverageRating(tenantId, employeeId);
  }

  @Get('employee/:employeeId/history')
  async getHistory(
    @Param('employeeId') employeeId: string,
    @Headers('x-tenant-id') tenantId: string,
  ) {
    return this.performanceService.getEmployeeReviewHistory(tenantId, employeeId);
  }

  @Get(':id')
  async getReview(
    @Param('id') reviewId: string,
    @Headers('x-tenant-id') tenantId: string,
  ) {
    return this.performanceService.getReview(tenantId, reviewId);
  }

  @Put(':id')
  async updateReview(
    @Param('id') reviewId: string,
    @Body() data: any,
    @Headers('x-tenant-id') tenantId: string,
  ) {
    return this.performanceService.createReview(tenantId, data);
  }

  @Post(':id/submit')
  async submitReview(
    @Param('id') reviewId: string,
    @Headers('x-tenant-id') tenantId: string,
  ) {
    return this.performanceService.submitReview(tenantId, reviewId);
  }

  @Post(':id/approve')
  async approveReview(
    @Param('id') reviewId: string,
    @Body() body: { approverName: string },
    @Headers('x-tenant-id') tenantId: string,
  ) {
    return this.performanceService.approveReview(tenantId, reviewId, body.approverName);
  }
}
