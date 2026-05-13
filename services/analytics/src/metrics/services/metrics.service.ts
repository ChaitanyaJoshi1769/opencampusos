import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class MetricsService {
  private logger = new Logger(MetricsService.name);

  constructor(private prisma: PrismaService) {}

  async recordMetric(tenantId: string, metric: any) {
    this.logger.log(`Recording metric ${metric.name} for tenant ${tenantId}`);
    return this.prisma.metric.create({
      data: {
        ...metric,
        tenantId,
        timestamp: new Date(),
      },
    });
  }

  async getMetrics(tenantId: string, name?: string, startDate?: Date, endDate?: Date) {
    const where: any = { tenantId };

    if (name) {
      where.name = name;
    }

    if (startDate || endDate) {
      where.timestamp = {};
      if (startDate) {
        where.timestamp.gte = startDate;
      }
      if (endDate) {
        where.timestamp.lte = endDate;
      }
    }

    return this.prisma.metric.findMany({
      where,
      orderBy: { timestamp: 'desc' },
    });
  }

  async aggregateMetrics(tenantId: string, name: string, interval: 'hour' | 'day' | 'week' | 'month') {
    this.logger.log(`Aggregating ${name} metrics by ${interval}`);

    const metrics = await this.prisma.metric.findMany({
      where: {
        tenantId,
        name,
      },
      orderBy: { timestamp: 'asc' },
    });

    const aggregated = this.groupByInterval(metrics, interval);
    return aggregated;
  }

  private groupByInterval(metrics: any[], interval: string) {
    const grouped: any = {};

    metrics.forEach((metric) => {
      let key: string;
      const date = new Date(metric.timestamp);

      if (interval === 'hour') {
        key = date.toISOString().substring(0, 13);
      } else if (interval === 'day') {
        key = date.toISOString().substring(0, 10);
      } else if (interval === 'week') {
        const weekStart = new Date(date);
        weekStart.setDate(weekStart.getDate() - weekStart.getDay());
        key = weekStart.toISOString().substring(0, 10);
      } else if (interval === 'month') {
        key = date.toISOString().substring(0, 7);
      }

      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(metric);
    });

    return grouped;
  }

  async deleteMetrics(tenantId: string, id: string) {
    return this.prisma.metric.delete({
      where: { id },
    });
  }

  async getMetricSummary(tenantId: string, metricNames: string[]) {
    const summaries = await Promise.all(
      metricNames.map(async (name) => {
        const metrics = await this.prisma.metric.findMany({
          where: {
            tenantId,
            name,
          },
          orderBy: { timestamp: 'desc' },
          take: 1,
        });

        return {
          name,
          latest: metrics[0] || null,
        };
      }),
    );

    return summaries;
  }
}
