import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Headers,
  Query,
} from '@nestjs/common';
import { BudgetService } from '../services/budget.service';

@Controller('budgets')
export class BudgetController {
  constructor(private budgetService: BudgetService) {}

  @Post()
  async createBudget(
    @Headers('x-tenant-id') tenantId: string,
    @Body() body: any,
  ) {
    return this.budgetService.createBudget(tenantId, body);
  }

  @Get(':budgetId')
  async getBudget(
    @Headers('x-tenant-id') tenantId: string,
    @Param('budgetId') budgetId: string,
  ) {
    return this.budgetService.getBudget(tenantId, budgetId);
  }

  @Get()
  async listBudgets(
    @Headers('x-tenant-id') tenantId: string,
    @Query('departmentId') departmentId?: string,
    @Query('year') year?: number,
  ) {
    return this.budgetService.listBudgets(tenantId, departmentId, year);
  }

  @Patch(':budgetId')
  async updateBudget(
    @Headers('x-tenant-id') tenantId: string,
    @Param('budgetId') budgetId: string,
    @Body() body: any,
  ) {
    return this.budgetService.updateBudget(tenantId, budgetId, body);
  }

  @Post(':budgetId/approve')
  async approveBudget(
    @Headers('x-tenant-id') tenantId: string,
    @Headers('x-user-id') userId: string,
    @Param('budgetId') budgetId: string,
  ) {
    return this.budgetService.approveBudget(tenantId, budgetId, userId);
  }

  @Get(':budgetId/status')
  async getBudgetStatus(
    @Headers('x-tenant-id') tenantId: string,
    @Param('budgetId') budgetId: string,
  ) {
    return this.budgetService.getBudgetStatus(tenantId, budgetId);
  }

  @Get('analysis/comparative')
  async getComparativeAnalysis(
    @Headers('x-tenant-id') tenantId: string,
    @Query('year') year: number,
  ) {
    return this.budgetService.getComparativeAnalysis(tenantId, year);
  }
}
