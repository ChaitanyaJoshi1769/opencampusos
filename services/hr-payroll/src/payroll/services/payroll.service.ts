import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PayrollService {
  constructor(private prisma: PrismaService) {}

  async createPayroll(tenantId: string, data: any) {
    return this.prisma.payroll.create({
      data: {
        ...data,
        tenantId,
        grossPay: parseFloat(data.grossPay) || 0,
        netPay: parseFloat(data.netPay) || 0,
        status: 'draft',
      },
      include: { employee: true },
    });
  }

  async getPayroll(tenantId: string, payrollId: string) {
    return this.prisma.payroll.findFirst({
      where: { id: payrollId, tenantId },
      include: { employee: true },
    });
  }

  async listPayroll(tenantId: string, filters?: any) {
    return this.prisma.payroll.findMany({
      where: {
        tenantId,
        ...(filters?.employeeId && { employeeId: filters.employeeId }),
        ...(filters?.status && { status: filters.status }),
        ...(filters?.payPeriod && { payPeriod: filters.payPeriod }),
      },
      include: { employee: true },
      orderBy: { payDate: 'desc' },
      skip: filters?.skip || 0,
      take: filters?.take || 20,
    });
  }

  async processPayroll(tenantId: string, payrollId: string, approverName: string) {
    return this.prisma.payroll.update({
      where: { id: payrollId },
      data: { status: 'processed', processedBy: approverName, processedAt: new Date() },
    });
  }

  async approvePayroll(tenantId: string, payrollId: string, approverName: string) {
    return this.prisma.payroll.update({
      where: { id: payrollId },
      data: { status: 'approved', approvedBy: approverName, approvedAt: new Date() },
    });
  }

  async getPayrollByEmployee(tenantId: string, employeeId: string) {
    return this.prisma.payroll.findMany({
      where: { tenantId, employeeId },
      orderBy: { payDate: 'desc' },
    });
  }

  async generatePayrollReport(tenantId: string, payPeriod: string) {
    const payrolls = await this.prisma.payroll.findMany({
      where: { tenantId, payPeriod, status: 'processed' },
      include: { employee: true },
    });

    const totalGrossPay = payrolls.reduce((sum, p) => sum + p.grossPay, 0);
    const totalDeductions = payrolls.reduce((sum, p) => sum + (p.grossPay - p.netPay), 0);
    const totalNetPay = payrolls.reduce((sum, p) => sum + p.netPay, 0);

    return {
      payPeriod,
      totalEmployees: payrolls.length,
      totalGrossPay,
      totalDeductions,
      totalNetPay,
      averageGrossPay: payrolls.length > 0 ? totalGrossPay / payrolls.length : 0,
      payrolls,
    };
  }

  async getTaxSummary(tenantId: string, payPeriod: string) {
    const payrolls = await this.prisma.payroll.findMany({
      where: { tenantId, payPeriod, status: 'processed' },
    });

    const totalTaxes = payrolls.reduce((sum, p) => sum + (p.taxes || 0), 0);
    const totalSocialSecurity = payrolls.reduce((sum, p) => sum + (p.socialSecurity || 0), 0);

    return {
      payPeriod,
      totalTaxes,
      totalSocialSecurity,
      totalDeductions: totalTaxes + totalSocialSecurity,
      employeeCount: payrolls.length,
    };
  }

  async getPayrollStats(tenantId: string) {
    const total = await this.prisma.payroll.count({ where: { tenantId } });
    const processed = await this.prisma.payroll.count({
      where: { tenantId, status: 'processed' },
    });
    const approved = await this.prisma.payroll.count({
      where: { tenantId, status: 'approved' },
    });
    const draft = await this.prisma.payroll.count({
      where: { tenantId, status: 'draft' },
    });

    return { total, processed, approved, draft };
  }
}
