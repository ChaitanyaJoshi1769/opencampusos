import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Headers,
  Query,
} from '@nestjs/common';
import { CostService } from '../services/cost.service';

@Controller('costs')
export class CostController {
  constructor(private costService: CostService) {}

  @Post()
  async recordCost(
    @Headers('x-tenant-id') tenantId: string,
    @Body() body: any,
  ) {
    return this.costService.recordCost(tenantId, body);
  }

  @Get()
  async getCosts(
    @Headers('x-tenant-id') tenantId: string,
    @Query('departmentId') departmentId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.costService.getCosts(
      tenantId,
      departmentId,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
    );
  }

  @Get('analysis/:departmentId/:year')
  async analyze(
    @Headers('x-tenant-id') tenantId: string,
    @Param('departmentId') departmentId: string,
    @Param('year') year: number,
  ) {
    return this.costService.getCostAnalysis(tenantId, departmentId, year);
  }

  @Get('top')
  async getTopCosts(
    @Headers('x-tenant-id') tenantId: string,
    @Query('limit') limit: number = 10,
  ) {
    return this.costService.getTopCosts(tenantId, limit);
  }

  @Get('alerts/:budgetId')
  async checkThreshold(
    @Headers('x-tenant-id') tenantId: string,
    @Param('budgetId') budgetId: string,
    @Query('threshold') threshold: number,
  ) {
    return this.costService.alertOnThreshold(tenantId, budgetId, threshold);
  }
}
