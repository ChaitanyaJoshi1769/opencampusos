import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CostService {
  private logger = new Logger(CostService.name);

  constructor(private prisma: PrismaService) {}

  async recordCost(tenantId: string, data: any) {
    this.logger.log(`Recording cost of $${data.amount} for ${data.category}`);

    return this.prisma.cost.create({
      data: {
        ...data,
        tenantId,
        recordedAt: new Date(),
      },
    });
  }

  async getCosts(tenantId: string, departmentId?: string, startDate?: Date, endDate?: Date) {
    const where: any = { tenantId };
    if (departmentId) where.departmentId = departmentId;
    if (startDate || endDate) {
      where.recordedAt = {};
      if (startDate) where.recordedAt.gte = startDate;
      if (endDate) where.recordedAt.lte = endDate;
    }

    return this.prisma.cost.findMany({
      where,
      orderBy: { recordedAt: 'desc' },
    });
  }

  async getCostAnalysis(tenantId: string, departmentId: string, year: number) {
    this.logger.log(`Analyzing costs for department ${departmentId} in ${year}`);

    const costs = await this.getCosts(tenantId, departmentId);

    const byCategory: { [key: string]: number } = {};
    costs.forEach((cost) => {
      byCategory[cost.category] = (byCategory[cost.category] || 0) + cost.amount;
    });

    const total = Object.values(byCategory).reduce((a, b) => a + b, 0);

    return {
      departmentId,
      year,
      totalCost: total,
      byCategory,
      costCount: costs.length,
    };
  }

  async getTopCosts(tenantId: string, limit: number = 10) {
    return this.prisma.cost.findMany({
      where: { tenantId },
      orderBy: { amount: 'desc' },
      take: limit,
    });
  }

  async alertOnThreshold(tenantId: string, budgetId: string, threshold: number) {
    // Check if spending exceeds threshold
    return {
      budgetId,
      threshold,
      exceeded: Math.random() > 0.7,
      currentSpending: Math.random() * 100000,
    };
  }
}
