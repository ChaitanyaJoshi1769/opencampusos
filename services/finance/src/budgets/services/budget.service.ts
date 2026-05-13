import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class BudgetService {
  constructor(private prisma: PrismaService) {}

  async createBudget(tenantId: string, data: any) {
    return this.prisma.budget.create({
      data: { ...data, tenantId, status: 'draft', amount: parseFloat(data.amount) },
    });
  }

  async getBudget(tenantId: string, budgetId: string) {
    return this.prisma.budget.findFirst({
      where: { id: budgetId, tenantId },
      include: { expenses: true },
    });
  }

  async listBudgets(tenantId: string, filters?: any) {
    return this.prisma.budget.findMany({
      where: {
        tenantId,
        ...(filters?.department && { department: filters.department }),
        ...(filters?.fiscalYear && { fiscalYear: filters.fiscalYear }),
        ...(filters?.status && { status: filters.status }),
      },
      orderBy: { fiscalYear: 'desc' },
      skip: filters?.skip || 0,
      take: filters?.take || 20,
    });
  }

  async updateBudget(tenantId: string, budgetId: string, data: any) {
    return this.prisma.budget.update({
      where: { id: budgetId },
      data: { ...data, amount: data.amount ? parseFloat(data.amount) : undefined },
    });
  }

  async approveBudget(tenantId: string, budgetId: string, approverName: string) {
    return this.prisma.budget.update({
      where: { id: budgetId },
      data: { status: 'approved', approvedBy: approverName, approvedAt: new Date() },
    });
  }

  async rejectBudget(tenantId: string, budgetId: string, reason: string) {
    return this.prisma.budget.update({
      where: { id: budgetId },
      data: { status: 'rejected', rejectionReason: reason, rejectedAt: new Date() },
    });
  }

  async getBudgetStatus(tenantId: string, budgetId: string) {
    const budget = await this.getBudget(tenantId, budgetId);
    if (!budget) return null;

    const totalExpenses = budget.expenses.reduce((sum, e) => sum + e.amount, 0);
    const remaining = budget.amount - totalExpenses;
    const percentUsed = (totalExpenses / budget.amount) * 100;

    return {
      budgetId: budget.id,
      amount: budget.amount,
      totalExpenses,
      remaining,
      percentUsed: Math.round(percentUsed * 100) / 100,
      status: budget.status,
    };
  }

  async getDepartmentBudget(tenantId: string, department: string, fiscalYear: string) {
    return this.prisma.budget.findMany({
      where: { tenantId, department, fiscalYear },
      include: { expenses: true },
    });
  }

  async getBudgetComparison(tenantId: string, fiscalYear: string) {
    const budgets = await this.prisma.budget.findMany({
      where: { tenantId, fiscalYear },
      include: { expenses: true },
    });

    const comparison = budgets.map(b => ({
      department: b.department,
      budgeted: b.amount,
      spent: b.expenses.reduce((sum, e) => sum + e.amount, 0),
      percentUsed: (b.expenses.reduce((sum, e) => sum + e.amount, 0) / b.amount) * 100,
    }));

    return {
      fiscalYear,
      budgets: comparison,
      totalBudget: budgets.reduce((sum, b) => sum + b.amount, 0),
      totalSpent: budgets.reduce((sum, b) => sum + b.expenses.reduce((esum, e) => esum + e.amount, 0), 0),
    };
  }

  async checkBudgetAlert(tenantId: string, budgetId: string, threshold = 85) {
    const status = await this.getBudgetStatus(tenantId, budgetId);
    if (!status) return null;

    return {
      budgetId,
      isAlert: status.percentUsed >= threshold,
      percentUsed: status.percentUsed,
      threshold,
    };
  }
}
