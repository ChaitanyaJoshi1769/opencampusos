import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Headers,
  Query,
} from '@nestjs/common';
import { MetricsService } from '../services/metrics.service';

@Controller('metrics')
export class MetricsController {
  constructor(private metricsService: MetricsService) {}

  @Post()
  async recordMetric(
    @Headers('x-tenant-id') tenantId: string,
    @Body() body: any,
  ) {
    return this.metricsService.recordMetric(tenantId, body);
  }

  @Get()
  async getMetrics(
    @Headers('x-tenant-id') tenantId: string,
    @Query('name') name?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.metricsService.getMetrics(
      tenantId,
      name,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
    );
  }

  @Get('aggregate/:name')
  async aggregateMetrics(
    @Headers('x-tenant-id') tenantId: string,
    @Param('name') name: string,
    @Query('interval') interval: 'hour' | 'day' | 'week' | 'month' = 'day',
  ) {
    return this.metricsService.aggregateMetrics(tenantId, name, interval);
  }

  @Get('summary')
  async getMetricSummary(
    @Headers('x-tenant-id') tenantId: string,
    @Query('names') names: string,
  ) {
    const metricNames = names ? names.split(',') : [];
    return this.metricsService.getMetricSummary(tenantId, metricNames);
  }

  @Delete(':id')
  async deleteMetric(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
  ) {
    return this.metricsService.deleteMetrics(tenantId, id);
  }
}
