import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AlertService {
  private logger = new Logger(AlertService.name);

  constructor(private prisma: PrismaService) {}

  async createAlert(tenantId: string, studentId: string, data: any) {
    this.logger.log(`Creating alert for student ${studentId}`);
    return this.prisma.alert.create({
      data: { tenantId, studentId, ...data, status: 'active' },
    });
  }

  async getStudentAlerts(tenantId: string, studentId: string, status?: string) {
    const where: any = { tenantId, studentId };
    if (status) where.status = status;

    return this.prisma.alert.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  async dismissAlert(tenantId: string, alertId: string) {
    return this.prisma.alert.update({
      where: { id: alertId },
      data: { status: 'dismissed', dismissedAt: new Date() },
    });
  }

  async getAlertSummary(tenantId: string) {
    const alerts = await this.prisma.alert.findMany({ where: { tenantId } });
    const active = alerts.filter((a) => a.status === 'active').length;
    const riskStudents = new Set(alerts.map((a) => a.studentId)).size;

    return {
      totalAlerts: alerts.length,
      activeAlerts: active,
      studentsAtRisk: riskStudents,
      alertTypes: [...new Set(alerts.map((a) => a.type))],
    };
  }

  async triggerEarlyWarning(tenantId: string, studentId: string) {
    const alert = await this.createAlert(tenantId, studentId, {
      type: 'early_warning',
      severity: 'high',
      message: 'Early warning triggered for student',
    });
    return alert;
  }
}
