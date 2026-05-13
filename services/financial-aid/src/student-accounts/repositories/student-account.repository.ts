import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { StudentAccount, Prisma } from '@prisma/client';

@Injectable()
export class StudentAccountRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(tenantId: string, studentId: string): Promise<StudentAccount> {
    const accountNumber = `ACC-${Date.now()}`;
    return this.prisma.studentAccount.create({
      data: {
        tenantId,
        studentId,
        accountNumber,
        balance: 0,
        status: 'active',
      },
    });
  }

  async findByStudentId(tenantId: string, studentId: string): Promise<StudentAccount | null> {
    return this.prisma.studentAccount.findFirst({
      where: { tenantId, studentId },
    });
  }

  async findById(tenantId: string, id: string): Promise<StudentAccount | null> {
    return this.prisma.studentAccount.findFirst({
      where: { tenantId, id },
    });
  }

  async findMany(tenantId: string, skip?: number, take?: number) {
    const [accounts, total] = await Promise.all([
      this.prisma.studentAccount.findMany({
        where: { tenantId },
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.studentAccount.count({ where: { tenantId } }),
    ]);
    return { accounts, total };
  }

  async updateBalance(id: string, newBalance: number): Promise<StudentAccount> {
    return this.prisma.studentAccount.update({
      where: { id },
      data: { balance: newBalance, updatedAt: new Date() },
    });
  }

  async getAccountBalance(tenantId: string, studentId: string): Promise<number> {
    const account = await this.findByStudentId(tenantId, studentId);
    return account?.balance || 0;
  }

  async getAccountsWithBalance(tenantId: string, minBalance: number) {
    return this.prisma.studentAccount.findMany({
      where: {
        tenantId,
        balance: { gt: minBalance },
      },
    });
  }
}
