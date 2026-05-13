import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ExpenseService {
  constructor(private prisma: PrismaService) {}

  async recordExpense(tenantId: string, data: any) {
    return this.prisma.expense.create({
      data: {
        ...data,
        tenantId,
        amount: parseFloat(data.amount),
        status: 'pending',
      },
      include: { budget: true },
    });
  }

  async getExpense(tenantId: string, expenseId: string) {
    return this.prisma.expense.findFirst({
      where: { id: expenseId, tenantId },
      include: { budget: true },
    });
  }

  async listExpenses(tenantId: string, filters?: any) {
    return this.prisma.expense.findMany({
      where: {
        tenantId,
        ...(filters?.budgetId && { budgetId: filters.budgetId }),
        ...(filters?.status && { status: filters.status }),
        ...(filters?.from && { date: { gte: new Date(filters.from) } }),
        ...(filters?.to && { date: { lte: new Date(filters.to) } }),
        ...(filters?.category && { category: filters.category }),
      },
      include: { budget: true },
      orderBy: { date: 'desc' },
      skip: filters?.skip || 0,
      take: filters?.take || 20,
    });
  }

  async approveExpense(tenantId: string, expenseId: string, approverName: string) {
    return this.prisma.expense.update({
      where: { id: expenseId },
      data: { status: 'approved', approvedBy: approverName, approvedAt: new Date() },
    });
  }

  async rejectExpense(tenantId: string, expenseId: string, reason: string) {
    return this.prisma.expense.update({
      where: { id: expenseId },
      data: { status: 'rejected', rejectionReason: reason },
    });
  }

  async getExpensesByCategory(tenantId: string, category: string, startDate: Date, endDate: Date) {
    return this.prisma.expense.findMany({
      where: {
        tenantId,
        category,
        date: { gte: startDate, lte: endDate },
      },
      orderBy: { date: 'desc' },
    });
  }

  async getExpenseAnalysis(tenantId: string, startDate: Date, endDate: Date) {
    const expenses = await this.prisma.expense.findMany({
      where: {
        tenantId,
        date: { gte: startDate, lte: endDate },
        status: 'approved',
      },
    });

    const byCategory = {};
    expenses.forEach(e => {
      if (!byCategory[e.category]) {
        byCategory[e.category] = 0;
      }
      byCategory[e.category] += e.amount;
    });

    return {
      startDate,
      endDate,
      totalExpenses: expenses.reduce((sum, e) => sum + e.amount, 0),
      byCategory,
      expenseCount: expenses.length,
      averageExpense: expenses.length > 0
        ? expenses.reduce((sum, e) => sum + e.amount, 0) / expenses.length
        : 0,
    };
  }

  async getPendingExpenses(tenantId: string) {
    return this.prisma.expense.findMany({
      where: { tenantId, status: 'pending' },
      include: { budget: true },
      orderBy: { date: 'asc' },
    });
  }

  async getExpenseStats(tenantId: string) {
    const total = await this.prisma.expense.count({ where: { tenantId } });
    const approved = await this.prisma.expense.count({
      where: { tenantId, status: 'approved' },
    });
    const pending = await this.prisma.expense.count({
      where: { tenantId, status: 'pending' },
    });
    const rejected = await this.prisma.expense.count({
      where: { tenantId, status: 'rejected' },
    });

    const totalAmount = await this.prisma.expense.aggregate({
      where: { tenantId },
      _sum: { amount: true },
    });

    return { total, approved, pending, rejected, totalAmount: totalAmount._sum.amount || 0 };
  }
}
