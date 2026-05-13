import { Controller, Get, Post, Put, Body, Param, Query, Headers } from '@nestjs/common';
import { BudgetService } from '../services/budget.service';

@Controller('budgets')
export class BudgetController {
  constructor(private budgetService: BudgetService) {}

  @Post()
  async createBudget(@Body() data: any, @Headers('x-tenant-id') tenantId: string) {
    return this.budgetService.createBudget(tenantId, data);
  }

  @Get()
  async listBudgets(@Query() filters: any, @Headers('x-tenant-id') tenantId: string) {
    return this.budgetService.listBudgets(tenantId, filters);
  }

  @Get('comparison')
  async getComparison(
    @Query('fiscalYear') fiscalYear: string,
    @Headers('x-tenant-id') tenantId: string,
  ) {
    return this.budgetService.getBudgetComparison(tenantId, fiscalYear);
  }

  @Get(':id')
  async getBudget(
    @Param('id') budgetId: string,
    @Headers('x-tenant-id') tenantId: string,
  ) {
    return this.budgetService.getBudget(tenantId, budgetId);
  }

  @Get(':id/status')
  async getBudgetStatus(
    @Param('id') budgetId: string,
    @Headers('x-tenant-id') tenantId: string,
  ) {
    return this.budgetService.getBudgetStatus(tenantId, budgetId);
  }

  @Get(':id/alert')
  async checkAlert(
    @Param('id') budgetId: string,
    @Query('threshold') threshold?: string,
    @Headers('x-tenant-id') tenantId?: string,
  ) {
    return this.budgetService.checkBudgetAlert(tenantId, budgetId, threshold ? parseInt(threshold) : 85);
  }

  @Put(':id')
  async updateBudget(
    @Param('id') budgetId: string,
    @Body() data: any,
    @Headers('x-tenant-id') tenantId: string,
  ) {
    return this.budgetService.updateBudget(tenantId, budgetId, data);
  }

  @Post(':id/approve')
  async approveBudget(
    @Param('id') budgetId: string,
    @Body() body: { approverName: string },
    @Headers('x-tenant-id') tenantId: string,
  ) {
    return this.budgetService.approveBudget(tenantId, budgetId, body.approverName);
  }

  @Post(':id/reject')
  async rejectBudget(
    @Param('id') budgetId: string,
    @Body() body: { reason: string },
    @Headers('x-tenant-id') tenantId: string,
  ) {
    return this.budgetService.rejectBudget(tenantId, budgetId, body.reason);
  }

  @Get('department/:department')
  async getDepartmentBudget(
    @Param('department') department: string,
    @Query('fiscalYear') fiscalYear: string,
    @Headers('x-tenant-id') tenantId: string,
  ) {
    return this.budgetService.getDepartmentBudget(tenantId, department, fiscalYear);
  }
}
