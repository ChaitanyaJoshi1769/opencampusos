import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Payment } from '@prisma/client';

@Injectable()
export class PaymentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    tenantId: string,
    studentAccountId: string,
    data: {
      chargeIds: string[];
      amount: number;
      paymentMethod: string;
      reference?: string;
      notes?: string;
    },
  ): Promise<Payment> {
    return this.prisma.payment.create({
      data: {
        tenantId,
        studentAccountId,
        ...data,
        chargeIds: data.chargeIds,
        status: 'completed',
      },
    });
  }

  async findById(tenantId: string, id: string): Promise<Payment | null> {
    return this.prisma.payment.findFirst({
      where: { tenantId, id },
    });
  }

  async findByStudentAccount(tenantId: string, studentAccountId: string) {
    const [payments, total] = await Promise.all([
      this.prisma.payment.findMany({
        where: { tenantId, studentAccountId },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.payment.count({
        where: { tenantId, studentAccountId },
      }),
    ]);
    return { payments, total };
  }

  async findByMethod(tenantId: string, method: string) {
    return this.prisma.payment.findMany({
      where: { tenantId, paymentMethod: method },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getTotalReceived(tenantId: string): Promise<number> {
    const result = await this.prisma.payment.aggregate({
      where: { tenantId, status: 'completed' },
      _sum: { amount: true },
    });
    return result._sum.amount || 0;
  }

  async getPaymentsInDateRange(tenantId: string, startDate: Date, endDate: Date) {
    return this.prisma.payment.findMany({
      where: {
        tenantId,
        status: 'completed',
        createdAt: { gte: startDate, lte: endDate },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getOutstandingPayments(tenantId: string) {
    return this.prisma.payment.findMany({
      where: { tenantId, status: 'pending' },
      orderBy: { createdAt: 'asc' },
    });
  }

  async updateStatus(id: string, status: 'pending' | 'completed' | 'failed'): Promise<Payment> {
    return this.prisma.payment.update({
      where: { id },
      data: { status, updatedAt: new Date() },
    });
  }

  async refund(id: string, refundAmount: number): Promise<Payment> {
    return this.prisma.payment.update({
      where: { id },
      data: {
        status: 'refunded',
        refundAmount,
        updatedAt: new Date()
      },
    });
  }
}
