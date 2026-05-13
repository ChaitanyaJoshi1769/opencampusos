import {
  Controller,
  Get,
  Param,
  Headers,
  Query,
} from '@nestjs/common';
import { ForecastService } from '../services/forecast.service';

@Controller('forecasting')
export class ForecastController {
  constructor(private forecastService: ForecastService) {}

  @Get('forecast/:departmentId')
  async generateForecast(
    @Headers('x-tenant-id') tenantId: string,
    @Param('departmentId') departmentId: string,
    @Query('months') months: number = 12,
  ) {
    return this.forecastService.generateForecast(tenantId, departmentId, months);
  }

  @Get('trends/:departmentId')
  async getTrends(
    @Headers('x-tenant-id') tenantId: string,
    @Param('departmentId') departmentId: string,
  ) {
    return this.forecastService.getTrendAnalysis(tenantId, departmentId);
  }

  @Get('scenarios/:budgetId')
  async getScenarios(
    @Headers('x-tenant-id') tenantId: string,
    @Param('budgetId') budgetId: string,
  ) {
    return this.forecastService.getScenarioAnalysis(tenantId, budgetId);
  }

  @Get('roi/:investmentId')
  async getRoi(
    @Headers('x-tenant-id') tenantId: string,
    @Param('investmentId') investmentId: string,
  ) {
    return this.forecastService.getROI(tenantId, investmentId);
  }
}
