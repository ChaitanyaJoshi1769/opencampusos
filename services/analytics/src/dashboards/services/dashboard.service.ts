import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DashboardService {
  private readonly logger = new Logger(DashboardService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getInstitutionDashboard(tenantId: string) {
    const [studentCount, activeEnrollments, activePrograms, totalRevenue] = await Promise.all([
      this.prisma.student.count({ where: { tenantId } }),
      this.prisma.enrollment.count({
        where: {
          tenantId,
          status: 'active',
        },
      }),
      this.prisma.program.count({ where: { tenantId } }),
      this.getRevenueMetric(tenantId),
    ]);

    return {
      studentCount,
      activeEnrollments,
      activePrograms,
      totalRevenue,
      lastUpdated: new Date(),
    };
  }

  async getStudentPerformanceDashboard(tenantId: string) {
    const [averageGPA, atRiskStudents, onProbation] = await Promise.all([
      this.getAverageGPA(tenantId),
      this.getAtRiskStudentCount(tenantId),
      this.getProbationStudentCount(tenantId),
    ]);

    return {
      averageGPA,
      atRiskStudents,
      onProbation,
      lastUpdated: new Date(),
    };
  }

  async getAdmissionsDashboard(tenantId: string) {
    const [totalApplicants, applicantsByStatus, conversionRate] = await Promise.all([
      this.prisma.applicant.count({ where: { tenantId } }),
      this.getApplicantsByStatus(tenantId),
      this.getAdmissionConversionRate(tenantId),
    ]);

    return {
      totalApplicants,
      applicantsByStatus,
      conversionRate,
      lastUpdated: new Date(),
    };
  }

  async getFinancialDashboard(tenantId: string) {
    const [totalCharges, totalPayments, outstandingBalance, averageTuition] = await Promise.all([
      this.getTotalCharges(tenantId),
      this.getTotalPayments(tenantId),
      this.getOutstandingBalance(tenantId),
      this.getAverageTuition(tenantId),
    ]);

    return {
      totalCharges,
      totalPayments,
      outstandingBalance,
      averageTuition,
      collectionsRate: totalPayments / (totalCharges || 1),
      lastUpdated: new Date(),
    };
  }

  async getHRDashboard(tenantId: string) {
    const [totalFaculty, totalStaff, activeEmployees, byDepartment] = await Promise.all([
      this.prisma.faculty.count({ where: { tenantId } }),
      this.prisma.employee.count({ where: { tenantId } }),
      this.prisma.employee.count({ where: { tenantId, status: 'active' } }),
      this.getEmployeesByDepartment(tenantId),
    ]);

    return {
      totalFaculty,
      totalStaff,
      activeEmployees,
      byDepartment,
      lastUpdated: new Date(),
    };
  }

  private async getRevenueMetric(tenantId: string): Promise<number> {
    const result = await this.prisma.payment.aggregate({
      where: { tenantId, status: 'completed' },
      _sum: { amount: true },
    });
    return result._sum.amount || 0;
  }

  private async getAverageGPA(tenantId: string): Promise<number> {
    const result = await this.prisma.student.aggregate({
      where: { tenantId },
      _avg: { gpa: true },
    });
    return Math.round((result._avg.gpa || 0) * 100) / 100;
  }

  private async getAtRiskStudentCount(tenantId: string): Promise<number> {
    return this.prisma.student.count({
      where: { tenantId, gpa: { lt: 2.0 } },
    });
  }

  private async getProbationStudentCount(tenantId: string): Promise<number> {
    return this.prisma.student.count({
      where: { tenantId, status: 'on_probation' },
    });
  }

  private async getApplicantsByStatus(tenantId: string) {
    return this.prisma.applicant.groupBy({
      by: ['status'],
      where: { tenantId },
      _count: { id: true },
    });
  }

  private async getAdmissionConversionRate(tenantId: string): Promise<number> {
    const [total, accepted] = await Promise.all([
      this.prisma.applicant.count({ where: { tenantId } }),
      this.prisma.applicant.count({ where: { tenantId, status: 'accepted' } }),
    ]);
    return total > 0 ? (accepted / total) * 100 : 0;
  }

  private async getTotalCharges(tenantId: string): Promise<number> {
    const result = await this.prisma.charge.aggregate({
      where: { tenantId },
      _sum: { amount: true },
    });
    return result._sum.amount || 0;
  }

  private async getTotalPayments(tenantId: string): Promise<number> {
    const result = await this.prisma.payment.aggregate({
      where: { tenantId, status: 'completed' },
      _sum: { amount: true },
    });
    return result._sum.amount || 0;
  }

  private async getOutstandingBalance(tenantId: string): Promise<number> {
    const result = await this.prisma.charge.aggregate({
      where: { tenantId, status: 'open' },
      _sum: { amount: true },
    });
    return result._sum.amount || 0;
  }

  private async getAverageTuition(tenantId: string): Promise<number> {
    const result = await this.prisma.charge.aggregate({
      where: { tenantId, chargeType: 'tuition' },
      _avg: { amount: true },
    });
    return Math.round((result._avg.amount || 0) * 100) / 100;
  }

  private async getEmployeesByDepartment(tenantId: string) {
    return this.prisma.employee.groupBy({
      by: ['department'],
      where: { tenantId },
      _count: { id: true },
      _avg: { salary: true },
    });
  }
}
