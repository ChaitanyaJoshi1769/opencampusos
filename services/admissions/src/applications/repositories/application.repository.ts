import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Application } from '@prisma/client';

@Injectable()
export class ApplicationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    tenantId: string,
    data: {
      applicantId: string;
      programId: string;
      academicTerm: string;
      submissionDate: Date;
      status?: string;
      gpa?: number;
      testScore?: number;
      notes?: string;
    },
  ): Promise<Application> {
    return this.prisma.application.create({
      data: {
        tenantId,
        ...data,
        status: data.status || 'submitted',
      },
    });
  }

  async findById(tenantId: string, id: string): Promise<Application | null> {
    return this.prisma.application.findFirst({
      where: { tenantId, id },
    });
  }

  async findByApplicant(tenantId: string, applicantId: string) {
    const [applications, total] = await Promise.all([
      this.prisma.application.findMany({
        where: { tenantId, applicantId },
        orderBy: { submissionDate: 'desc' },
      }),
      this.prisma.application.count({
        where: { tenantId, applicantId },
      }),
    ]);
    return { applications, total };
  }

  async findByProgram(tenantId: string, programId: string) {
    const [applications, total] = await Promise.all([
      this.prisma.application.findMany({
        where: { tenantId, programId },
        orderBy: { submissionDate: 'desc' },
      }),
      this.prisma.application.count({
        where: { tenantId, programId },
      }),
    ]);
    return { applications, total };
  }

  async findByStatus(tenantId: string, status: string) {
    const [applications, total] = await Promise.all([
      this.prisma.application.findMany({
        where: { tenantId, status },
        orderBy: { submissionDate: 'desc' },
      }),
      this.prisma.application.count({
        where: { tenantId, status },
      }),
    ]);
    return { applications, total };
  }

  async findMany(tenantId: string, skip: number = 0, take: number = 20) {
    const [applications, total] = await Promise.all([
      this.prisma.application.findMany({
        where: { tenantId },
        skip,
        take,
        orderBy: { submissionDate: 'desc' },
      }),
      this.prisma.application.count({
        where: { tenantId },
      }),
    ]);
    return { applications, total };
  }

  async update(id: string, data: Partial<Application>): Promise<Application> {
    return this.prisma.application.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });
  }

  async updateStatus(id: string, status: string): Promise<Application> {
    return this.prisma.application.update({
      where: { id },
      data: { status, updatedAt: new Date() },
    });
  }

  async getStatistics(tenantId: string) {
    const [total, byStatus] = await Promise.all([
      this.prisma.application.count({ where: { tenantId } }),
      this.prisma.application.groupBy({
        by: ['status'],
        where: { tenantId },
        _count: { id: true },
      }),
    ]);
    return { total, byStatus };
  }

  async findApplicationsInTerm(tenantId: string, academicTerm: string) {
    return this.prisma.application.findMany({
      where: { tenantId, academicTerm },
      orderBy: { submissionDate: 'desc' },
    });
  }
}
