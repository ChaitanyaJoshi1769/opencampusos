import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Charge } from '@prisma/client';

@Injectable()
export class ChargeRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    tenantId: string,
    studentAccountId: string,
    data: {
      chargeType: string;
      amount: number;
      chargeDate: Date;
      dueDate: Date;
      description?: string;
      termId?: string;
    },
  ): Promise<Charge> {
    return this.prisma.charge.create({
      data: {
        tenantId,
        studentAccountId,
        ...data,
        status: 'open',
      },
    });
  }

  async findById(tenantId: string, id: string): Promise<Charge | null> {
    return this.prisma.charge.findFirst({
      where: { tenantId, id },
    });
  }

  async findByStudentAccount(tenantId: string, studentAccountId: string) {
    const [charges, total] = await Promise.all([
      this.prisma.charge.findMany({
        where: { tenantId, studentAccountId },
        orderBy: { dueDate: 'asc' },
      }),
      this.prisma.charge.count({
        where: { tenantId, studentAccountId },
      }),
    ]);
    return { charges, total };
  }

  async findOpen(tenantId: string, studentAccountId: string) {
    return this.prisma.charge.findMany({
      where: { tenantId, studentAccountId, status: 'open' },
      orderBy: { dueDate: 'asc' },
    });
  }

  async markPaid(id: string): Promise<Charge> {
    return this.prisma.charge.update({
      where: { id },
      data: { status: 'paid', updatedAt: new Date() },
    });
  }

  async getOverdueCharges(tenantId: string) {
    const today = new Date();
    return this.prisma.charge.findMany({
      where: {
        tenantId,
        status: 'open',
        dueDate: { lt: today },
      },
    });
  }

  async getTotalDue(tenantId: string, studentAccountId: string): Promise<number> {
    const result = await this.prisma.charge.aggregate({
      where: { tenantId, studentAccountId, status: 'open' },
      _sum: { amount: true },
    });
    return result._sum.amount || 0;
  }
}
