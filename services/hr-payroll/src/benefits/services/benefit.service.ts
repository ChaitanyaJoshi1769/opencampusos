import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class BenefitService {
  constructor(private prisma: PrismaService) {}

  async enrollBenefit(tenantId: string, employeeId: string, benefitType: string, data: any) {
    return this.prisma.benefit.create({
      data: {
        tenantId,
        employeeId,
        benefitType,
        ...data,
        status: 'active',
        enrollmentDate: new Date(),
      },
    });
  }

  async getEmployeeBenefits(tenantId: string, employeeId: string) {
    return this.prisma.benefit.findMany({
      where: { tenantId, employeeId, status: 'active' },
    });
  }

  async updateBenefit(tenantId: string, benefitId: string, data: any) {
    return this.prisma.benefit.update({
      where: { id: benefitId },
      data,
    });
  }

  async terminateBenefit(tenantId: string, benefitId: string) {
    return this.prisma.benefit.update({
      where: { id: benefitId },
      data: { status: 'terminated', terminationDate: new Date() },
    });
  }

  async getBenefitSummary(tenantId: string) {
    const benefits = await this.prisma.benefit.findMany({
      where: { tenantId, status: 'active' },
    });

    const byType = {};
    benefits.forEach(b => {
      byType[b.benefitType] = (byType[b.benefitType] || 0) + 1;
    });

    return {
      totalBenefits: benefits.length,
      byType,
    };
  }
}
