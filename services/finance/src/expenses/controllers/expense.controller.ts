import { Controller, Get, Post, Body, Param, Query, Headers } from '@nestjs/common';
import { ExpenseService } from '../services/expense.service';

@Controller('expenses')
export class ExpenseController {
  constructor(private expenseService: ExpenseService) {}

  @Post()
  async recordExpense(@Body() data: any, @Headers('x-tenant-id') tenantId: string) {
    return this.expenseService.recordExpense(tenantId, data);
  }

  @Get()
  async listExpenses(@Query() filters: any, @Headers('x-tenant-id') tenantId: string) {
    return this.expenseService.listExpenses(tenantId, filters);
  }

  @Get('pending')
  async getPending(@Headers('x-tenant-id') tenantId: string) {
    return this.expenseService.getPendingExpenses(tenantId);
  }

  @Get('stats')
  async getStats(@Headers('x-tenant-id') tenantId: string) {
    return this.expenseService.getExpenseStats(tenantId);
  }

  @Post('analysis')
  async getAnalysis(
    @Body() body: { startDate: string; endDate: string },
    @Headers('x-tenant-id') tenantId: string,
  ) {
    return this.expenseService.getExpenseAnalysis(tenantId, new Date(body.startDate), new Date(body.endDate));
  }

  @Get(':id')
  async getExpense(
    @Param('id') expenseId: string,
    @Headers('x-tenant-id') tenantId: string,
  ) {
    return this.expenseService.getExpense(tenantId, expenseId);
  }

  @Post(':id/approve')
  async approveExpense(
    @Param('id') expenseId: string,
    @Body() body: { approverName: string },
    @Headers('x-tenant-id') tenantId: string,
  ) {
    return this.expenseService.approveExpense(tenantId, expenseId, body.approverName);
  }

  @Post(':id/reject')
  async rejectExpense(
    @Param('id') expenseId: string,
    @Body() body: { reason: string },
    @Headers('x-tenant-id') tenantId: string,
  ) {
    return this.expenseService.rejectExpense(tenantId, expenseId, body.reason);
  }

  @Get('category/:category')
  async getByCategory(
    @Param('category') category: string,
    @Query('from') from: string,
    @Query('to') to: string,
    @Headers('x-tenant-id') tenantId: string,
  ) {
    return this.expenseService.getExpensesByCategory(tenantId, category, new Date(from), new Date(to));
  }
}
