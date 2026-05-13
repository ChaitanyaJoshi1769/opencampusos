import {
  Controller,
  Get,
  Param,
  Body,
  Headers,
  Post,
} from '@nestjs/common';
import { AnalyticsService } from '../services/analytics.service';

@Controller('analytics')
export class AnalyticsController {
  constructor(private analyticsService: AnalyticsService) {}

  @Get('surveys/:surveyId/report')
  async getReport(
    @Headers('x-tenant-id') tenantId: string,
    @Param('surveyId') surveyId: string,
  ) {
    return this.analyticsService.generateReport(tenantId, surveyId);
  }

  @Post('compare')
  async compare(
    @Headers('x-tenant-id') tenantId: string,
    @Body() body: { surveyIds: string[] },
  ) {
    return this.analyticsService.getComparativeAnalysis(tenantId, body.surveyIds);
  }

  @Get('surveys/:surveyId/insights')
  async getInsights(
    @Headers('x-tenant-id') tenantId: string,
    @Param('surveyId') surveyId: string,
  ) {
    return this.analyticsService.getInsights(tenantId, surveyId);
  }
}
