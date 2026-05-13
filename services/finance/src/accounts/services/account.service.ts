import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AccountService {
  constructor(private prisma: PrismaService) {}

  async createAccount(tenantId: string, data: any) {
    return this.prisma.chartOfAccount.create({
      data: { ...data, tenantId, balance: 0 },
    });
  }

  async getAccount(tenantId: string, accountId: string) {
    return this.prisma.chartOfAccount.findFirst({
      where: { id: accountId, tenantId },
      include: { journalEntries: { take: 5 } },
    });
  }

  async listAccounts(tenantId: string, filters?: any) {
    return this.prisma.chartOfAccount.findMany({
      where: {
        tenantId,
        ...(filters?.accountType && { accountType: filters.accountType }),
        ...(filters?.department && { department: filters.department }),
      },
      include: { _count: { select: { journalEntries: true } } },
      skip: filters?.skip || 0,
      take: filters?.take || 20,
    });
  }

  async updateAccountBalance(tenantId: string, accountId: string, amount: number) {
    const account = await this.prisma.chartOfAccount.findFirst({
      where: { id: accountId, tenantId },
    });

    if (!account) return null;

    return this.prisma.chartOfAccount.update({
      where: { id: accountId },
      data: { balance: account.balance + amount },
    });
  }

  async getAccountBalance(tenantId: string, accountId: string) {
    const account = await this.getAccount(tenantId, accountId);
    return { accountId, balance: account?.balance || 0 };
  }

  async getTrialBalance(tenantId: string) {
    const accounts = await this.prisma.chartOfAccount.findMany({
      where: { tenantId },
    });

    const totalDebits = accounts
      .filter(a => a.accountType === 'ASSET' || a.accountType === 'EXPENSE')
      .reduce((sum, a) => sum + a.balance, 0);

    const totalCredits = accounts
      .filter(a => a.accountType === 'LIABILITY' || a.accountType === 'EQUITY' || a.accountType === 'REVENUE')
      .reduce((sum, a) => sum + a.balance, 0);

    return {
      accounts: accounts.map(a => ({ ...a, type: a.accountType })),
      totalDebits,
      totalCredits,
      balanced: Math.abs(totalDebits - totalCredits) < 0.01,
    };
  }

  async getAccountsByType(tenantId: string, accountType: string) {
    return this.prisma.chartOfAccount.findMany({
      where: { tenantId, accountType },
      orderBy: { accountNumber: 'asc' },
    });
  }

  async deleteAccount(tenantId: string, accountId: string) {
    return this.prisma.chartOfAccount.delete({
      where: { id: accountId },
    });
  }
}
