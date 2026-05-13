import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Applicant } from '@prisma/client';

@Injectable()
export class ApplicantRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    tenantId: string,
    data: {
      firstName: string;
      lastName: string;
      email: string;
      phone?: string;
      dateOfBirth?: Date;
      address?: string;
      city?: string;
      state?: string;
      zipCode?: string;
      country?: string;
      status?: string;
    },
  ): Promise<Applicant> {
    return this.prisma.applicant.create({
      data: {
        tenantId,
        ...data,
        status: data.status || 'new',
      },
    });
  }

  async findById(tenantId: string, id: string): Promise<Applicant | null> {
    return this.prisma.applicant.findFirst({
      where: { tenantId, id },
    });
  }

  async findByEmail(tenantId: string, email: string): Promise<Applicant | null> {
    return this.prisma.applicant.findFirst({
      where: { tenantId, email },
    });
  }

  async findByStatus(tenantId: string, status: string) {
    const [applicants, total] = await Promise.all([
      this.prisma.applicant.findMany({
        where: { tenantId, status },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.applicant.count({
        where: { tenantId, status },
      }),
    ]);
    return { applicants, total };
  }

  async findMany(tenantId: string, skip: number = 0, take: number = 20) {
    const [applicants, total] = await Promise.all([
      this.prisma.applicant.findMany({
        where: { tenantId },
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.applicant.count({
        where: { tenantId },
      }),
    ]);
    return { applicants, total };
  }

  async searchByName(tenantId: string, query: string) {
    return this.prisma.applicant.findMany({
      where: {
        tenantId,
        OR: [
          { firstName: { contains: query, mode: 'insensitive' } },
          { lastName: { contains: query, mode: 'insensitive' } },
        ],
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async update(id: string, data: Partial<Applicant>): Promise<Applicant> {
    return this.prisma.applicant.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });
  }

  async updateStatus(id: string, status: string): Promise<Applicant> {
    return this.prisma.applicant.update({
      where: { id },
      data: { status, updatedAt: new Date() },
    });
  }

  async getStatistics(tenantId: string) {
    const [total, byStatus] = await Promise.all([
      this.prisma.applicant.count({ where: { tenantId } }),
      this.prisma.applicant.groupBy({
        by: ['status'],
        where: { tenantId },
        _count: { id: true },
      }),
    ]);
    return { total, byStatus };
  }

  async deleteApplicant(id: string): Promise<Applicant> {
    return this.prisma.applicant.delete({
      where: { id },
    });
  }
}
