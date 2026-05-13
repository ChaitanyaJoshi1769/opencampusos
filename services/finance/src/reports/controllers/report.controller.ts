import { Controller, Get, Body, Post, Query, Headers } from '@nestjs/common';
import { ReportService } from '../services/report.service';

@Controller('reports')
export class ReportController {
  constructor(private reportService: ReportService) {}

  @Post('income-statement')
  async generateIncomeStatement(
    @Body() body: { startDate: string; endDate: string },
    @Headers('x-tenant-id') tenantId: string,
  ) {
    return this.reportService.generateIncomeStatement(
      tenantId,
      new Date(body.startDate),
      new Date(body.endDate),
    );
  }

  @Post('balance-sheet')
  async generateBalanceSheet(
    @Body() body: { asOfDate: string },
    @Headers('x-tenant-id') tenantId: string,
  ) {
    return this.reportService.generateBalanceSheet(tenantId, new Date(body.asOfDate));
  }

  @Post('cash-flow')
  async generateCashFlow(
    @Body() body: { startDate: string; endDate: string },
    @Headers('x-tenant-id') tenantId: string,
  ) {
    return this.reportService.generateCashFlowReport(
      tenantId,
      new Date(body.startDate),
      new Date(body.endDate),
    );
  }

  @Get('department/:department')
  async generateDepartmentReport(
    @Query() query: { department: string },
    @Headers('x-tenant-id') tenantId: string,
  ) {
    return this.reportService.generateDepartmentReport(tenantId, query.department);
  }

  @Get('summary')
  async getFinancialSummary(@Headers('x-tenant-id') tenantId: string) {
    return this.reportService.generateFinancialSummary(tenantId);
  }
}
