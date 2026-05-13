import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class BudgetService {
  private logger = new Logger(BudgetService.name);

  constructor(private prisma: PrismaService) {}

  async createBudget(tenantId: string, data: any) {
    this.logger.log(`Creating budget for department ${data.departmentId}`);

    return this.prisma.budget.create({
      data: {
        ...data,
        tenantId,
        status: 'draft',
      },
    });
  }

  async getBudget(tenantId: string, budgetId: string) {
    const budget = await this.prisma.budget.findFirst({
      where: { id: budgetId, tenantId },
    });

    if (!budget) {
      throw new NotFoundException('Budget not found');
    }

    return budget;
  }

  async listBudgets(tenantId: string, departmentId?: string, year?: number) {
    const where: any = { tenantId };
    if (departmentId) where.departmentId = departmentId;
    if (year) where.year = year;

    return this.prisma.budget.findMany({ where, orderBy: { year: 'desc' } });
  }

  async updateBudget(tenantId: string, budgetId: string, data: any) {
    const budget = await this.getBudget(tenantId, budgetId);
    if (budget.status === 'approved') {
      throw new BadRequestException('Cannot edit approved budget');
    }

    return this.prisma.budget.update({
      where: { id: budgetId },
      data,
    });
  }

  async approveBudget(tenantId: string, budgetId: string, approver: string) {
    return this.prisma.budget.update({
      where: { id: budgetId },
      data: { status: 'approved', approvedBy: approver, approvedAt: new Date() },
    });
  }

  async getBudgetStatus(tenantId: string, budgetId: string) {
    const budget = await this.getBudget(tenantId, budgetId);
    const spent = Math.random() * budget.totalAmount;

    return {
      budgetId,
      allocated: budget.totalAmount,
      spent: parseFloat(spent.toFixed(2)),
      remaining: parseFloat((budget.totalAmount - spent).toFixed(2)),
      utilizationRate: parseFloat(((spent / budget.totalAmount) * 100).toFixed(2)),
      status: budget.status,
    };
  }

  async getComparativeAnalysis(tenantId: string, year: number) {
    const budgets = await this.listBudgets(tenantId, undefined, year);
    return budgets.map((b) => ({
      department: b.departmentId,
      amount: b.totalAmount,
      status: b.status,
    }));
  }
}
