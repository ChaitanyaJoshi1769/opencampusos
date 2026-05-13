import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ReportService {
  constructor(private prisma: PrismaService) {}

  async generateIncomeStatement(tenantId: string, startDate: Date, endDate: Date) {
    const revenues = await this.prisma.journalEntry.findMany({
      where: {
        tenantId,
        date: { gte: startDate, lte: endDate },
        account: { accountType: 'REVENUE' },
      },
      include: { account: true },
    });

    const expenses = await this.prisma.journalEntry.findMany({
      where: {
        tenantId,
        date: { gte: startDate, lte: endDate },
        account: { accountType: 'EXPENSE' },
      },
      include: { account: true },
    });

    const totalRevenue = revenues.reduce((sum, r) => sum + r.creditAmount, 0);
    const totalExpenses = expenses.reduce((sum, e) => sum + e.debitAmount, 0);

    return {
      period: { startDate, endDate },
      revenues: { total: totalRevenue, entries: revenues },
      expenses: { total: totalExpenses, entries: expenses },
      netIncome: totalRevenue - totalExpenses,
    };
  }

  async generateBalanceSheet(tenantId: string, asOfDate: Date) {
    const accounts = await this.prisma.chartOfAccount.findMany({
      where: { tenantId },
    });

    const assets = accounts
      .filter(a => a.accountType === 'ASSET')
      .reduce((sum, a) => sum + a.balance, 0);

    const liabilities = accounts
      .filter(a => a.accountType === 'LIABILITY')
      .reduce((sum, a) => sum + a.balance, 0);

    const equity = accounts
      .filter(a => a.accountType === 'EQUITY')
      .reduce((sum, a) => sum + a.balance, 0);

    return {
      asOfDate,
      assets: { accounts: accounts.filter(a => a.accountType === 'ASSET'), total: assets },
      liabilities: { accounts: accounts.filter(a => a.accountType === 'LIABILITY'), total: liabilities },
      equity: { accounts: accounts.filter(a => a.accountType === 'EQUITY'), total: equity },
      totalLiabilitiesAndEquity: liabilities + equity,
      balanced: Math.abs(assets - (liabilities + equity)) < 0.01,
    };
  }

  async generateCashFlowReport(tenantId: string, startDate: Date, endDate: Date) {
    const cashEntries = await this.prisma.journalEntry.findMany({
      where: {
        tenantId,
        date: { gte: startDate, lte: endDate },
        account: { accountNumber: { contains: 'CASH' } },
      },
      include: { account: true },
      orderBy: { date: 'asc' },
    });

    const operatingActivities = cashEntries.filter(e => e.description?.includes('Operating'));
    const investingActivities = cashEntries.filter(e => e.description?.includes('Investing'));
    const financingActivities = cashEntries.filter(e => e.description?.includes('Financing'));

    const calculateNetCash = (entries: any[]) => entries.reduce((sum, e) => sum + e.creditAmount - e.debitAmount, 0);

    return {
      period: { startDate, endDate },
      operatingActivities: {
        netCash: calculateNetCash(operatingActivities),
        entries: operatingActivities,
      },
      investingActivities: {
        netCash: calculateNetCash(investingActivities),
        entries: investingActivities,
      },
      financingActivities: {
        netCash: calculateNetCash(financingActivities),
        entries: financingActivities,
      },
    };
  }

  async generateDepartmentReport(tenantId: string, department: string) {
    const accounts = await this.prisma.chartOfAccount.findMany({
      where: { tenantId, department },
    });

    const totalBalance = accounts.reduce((sum, a) => sum + a.balance, 0);

    return {
      department,
      accounts: accounts.map(a => ({ ...a })),
      totalBalance,
      accountCount: accounts.length,
    };
  }

  async generateFinancialSummary(tenantId: string) {
    const accounts = await this.prisma.chartOfAccount.findMany({
      where: { tenantId },
    });

    return {
      totalAssets: accounts
        .filter(a => a.accountType === 'ASSET')
        .reduce((sum, a) => sum + a.balance, 0),
      totalLiabilities: accounts
        .filter(a => a.accountType === 'LIABILITY')
        .reduce((sum, a) => sum + a.balance, 0),
      totalEquity: accounts
        .filter(a => a.accountType === 'EQUITY')
        .reduce((sum, a) => sum + a.balance, 0),
      totalRevenue: accounts
        .filter(a => a.accountType === 'REVENUE')
        .reduce((sum, a) => sum + a.balance, 0),
      totalExpenses: accounts
        .filter(a => a.accountType === 'EXPENSE')
        .reduce((sum, a) => sum + a.balance, 0),
    };
  }
}
