import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { FinancialAidAward } from '@prisma/client';

@Injectable()
export class AidRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    tenantId: string,
    studentAccountId: string,
    data: {
      awardType: string;
      amount: number;
      academicYear?: string;
      source?: string;
      awardDate?: Date;
      disbursementDate?: Date;
      notes?: string;
    },
  ): Promise<FinancialAidAward> {
    return this.prisma.financialAidAward.create({
      data: {
        tenantId,
        studentAccountId,
        ...data,
        status: 'active',
      },
    });
  }

  async findById(tenantId: string, id: string): Promise<FinancialAidAward | null> {
    return this.prisma.financialAidAward.findFirst({
      where: { tenantId, id },
    });
  }

  async findByStudentAccount(tenantId: string, studentAccountId: string) {
    const [awards, total] = await Promise.all([
      this.prisma.financialAidAward.findMany({
        where: { tenantId, studentAccountId },
        orderBy: { awardDate: 'desc' },
      }),
      this.prisma.financialAidAward.count({
        where: { tenantId, studentAccountId },
      }),
    ]);
    return { awards, total };
  }

  async findByAwardType(tenantId: string, awardType: string) {
    return this.prisma.financialAidAward.findMany({
      where: { tenantId, awardType },
      orderBy: { awardDate: 'desc' },
    });
  }

  async findByStatus(tenantId: string, status: string) {
    return this.prisma.financialAidAward.findMany({
      where: { tenantId, status },
      orderBy: { awardDate: 'desc' },
    });
  }

  async getTotalAwarded(tenantId: string): Promise<number> {
    const result = await this.prisma.financialAidAward.aggregate({
      where: { tenantId, status: 'active' },
      _sum: { amount: true },
    });
    return result._sum.amount || 0;
  }

  async getTotalAwardedByType(tenantId: string, awardType: string): Promise<number> {
    const result = await this.prisma.financialAidAward.aggregate({
      where: { tenantId, awardType, status: 'active' },
      _sum: { amount: true },
    });
    return result._sum.amount || 0;
  }

  async getStudentTotalAwarded(tenantId: string, studentAccountId: string): Promise<number> {
    const result = await this.prisma.financialAidAward.aggregate({
      where: { tenantId, studentAccountId, status: 'active' },
      _sum: { amount: true },
    });
    return result._sum.amount || 0;
  }

  async updateStatus(id: string, status: 'active' | 'pending' | 'declined' | 'cancelled'): Promise<FinancialAidAward> {
    return this.prisma.financialAidAward.update({
      where: { id },
      data: { status, updatedAt: new Date() },
    });
  }

  async findAwaitingDisbursement(tenantId: string) {
    return this.prisma.financialAidAward.findMany({
      where: { tenantId, status: 'active', disbursementDate: null },
      orderBy: { awardDate: 'asc' },
    });
  }

  async recordDisbursement(id: string, disbursementDate: Date): Promise<FinancialAidAward> {
    return this.prisma.financialAidAward.update({
      where: { id },
      data: { disbursementDate, updatedAt: new Date() },
    });
  }
}
