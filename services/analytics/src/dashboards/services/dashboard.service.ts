import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DashboardService {
  private logger = new Logger(DashboardService.name);

  constructor(private prisma: PrismaService) {}

  async createDashboard(tenantId: string, data: any) {
    this.logger.log(`Creating dashboard for tenant ${tenantId}`);
    return this.prisma.dashboard.create({
      data: {
        ...data,
        tenantId,
      },
    });
  }

  async getDashboard(tenantId: string, dashboardId: string) {
    const dashboard = await this.prisma.dashboard.findFirst({
      where: {
        id: dashboardId,
        tenantId,
      },
      include: {
        widgets: true,
      },
    });

    if (!dashboard) {
      throw new NotFoundException('Dashboard not found');
    }

    return dashboard;
  }

  async listDashboards(tenantId: string, limit = 10, offset = 0) {
    const [dashboards, total] = await Promise.all([
      this.prisma.dashboard.findMany({
        where: { tenantId },
        include: { widgets: true },
        take: limit,
        skip: offset,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.dashboard.count({ where: { tenantId } }),
    ]);

    return { dashboards, total, limit, offset };
  }

  async updateDashboard(tenantId: string, dashboardId: string, data: any) {
    const dashboard = await this.getDashboard(tenantId, dashboardId);
    return this.prisma.dashboard.update({
      where: { id: dashboard.id },
      data,
      include: { widgets: true },
    });
  }

  async deleteDashboard(tenantId: string, dashboardId: string) {
    const dashboard = await this.getDashboard(tenantId, dashboardId);
    return this.prisma.dashboard.delete({
      where: { id: dashboard.id },
    });
  }

  async addWidget(tenantId: string, dashboardId: string, widgetData: any) {
    const dashboard = await this.getDashboard(tenantId, dashboardId);
    return this.prisma.widget.create({
      data: {
        ...widgetData,
        dashboardId: dashboard.id,
        tenantId,
      },
    });
  }

  async removeWidget(tenantId: string, widgetId: string) {
    const widget = await this.prisma.widget.findFirst({
      where: {
        id: widgetId,
        tenantId,
      },
    });

    if (!widget) {
      throw new NotFoundException('Widget not found');
    }

    return this.prisma.widget.delete({
      where: { id: widgetId },
    });
  }

  async generateDashboardReport(tenantId: string, dashboardId: string) {
    const dashboard = await this.getDashboard(tenantId, dashboardId);
    this.logger.log(`Generating report for dashboard ${dashboardId}`);

    const report = {
      id: dashboard.id,
      name: dashboard.name,
      generatedAt: new Date(),
      widgets: dashboard.widgets,
      summary: `Dashboard ${dashboard.name} report`,
    };

    return report;
  }
}
