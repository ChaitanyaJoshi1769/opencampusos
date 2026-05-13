import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class KpiService {
  private logger = new Logger(KpiService.name);

  constructor(private prisma: PrismaService) {}

  async createKpi(tenantId: string, data: any) {
    this.logger.log(`Creating KPI for tenant ${tenantId}`);
    return this.prisma.kpi.create({
      data: {
        ...data,
        tenantId,
      },
    });
  }

  async getKpi(tenantId: string, kpiId: string) {
    const kpi = await this.prisma.kpi.findFirst({
      where: {
        id: kpiId,
        tenantId,
      },
    });

    if (!kpi) {
      throw new NotFoundException('KPI not found');
    }

    return kpi;
  }

  async listKpis(tenantId: string, category?: string) {
    const where: any = { tenantId };
    if (category) {
      where.category = category;
    }

    return this.prisma.kpi.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateKpi(tenantId: string, kpiId: string, data: any) {
    const kpi = await this.getKpi(tenantId, kpiId);
    return this.prisma.kpi.update({
      where: { id: kpi.id },
      data,
    });
  }

  async deleteKpi(tenantId: string, kpiId: string) {
    const kpi = await this.getKpi(tenantId, kpiId);
    return this.prisma.kpi.delete({
      where: { id: kpi.id },
    });
  }

  async calculateKpi(tenantId: string, kpiId: string, formula?: string): Promise<any> {
    const kpi = await this.getKpi(tenantId, kpiId);
    this.logger.log(`Calculating KPI ${kpiId}`);

    const result = {
      id: kpi.id,
      name: kpi.name,
      category: kpi.category,
      currentValue: Math.random() * 100,
      targetValue: kpi.targetValue,
      status: 'on_track',
      lastCalculated: new Date(),
    };

    return result;
  }

  async getKpiTrend(tenantId: string, kpiId: string, days: number = 30) {
    const kpi = await this.getKpi(tenantId, kpiId);
    this.logger.log(`Getting trend for KPI ${kpiId} over ${days} days`);

    const trend = [];
    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      trend.push({
        date: date.toISOString().substring(0, 10),
        value: Math.random() * 100,
      });
    }

    return {
      kpiId: kpi.id,
      kpiName: kpi.name,
      trend,
    };
  }

  async compareKpis(tenantId: string, kpiIds: string[]) {
    this.logger.log(`Comparing ${kpiIds.length} KPIs`);

    const kpis = await Promise.all(
      kpiIds.map((id) => this.getKpi(tenantId, id)),
    );

    const comparison = kpis.map((kpi) => ({
      id: kpi.id,
      name: kpi.name,
      category: kpi.category,
      targetValue: kpi.targetValue,
      currentValue: Math.random() * 100,
    }));

    return comparison;
  }

  async getKpisByCategory(tenantId: string, category: string) {
    return this.prisma.kpi.findMany({
      where: {
        tenantId,
        category,
      },
    });
  }
}
