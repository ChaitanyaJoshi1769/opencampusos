import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Faculty } from '@prisma/client';

@Injectable()
export class FacultyRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    tenantId: string,
    data: {
      userId: string;
      department: string;
      title: string;
      specialization?: string;
      officeLocation?: string;
      officeHours?: string;
      researchInterests?: string;
      hireDate: Date;
      status: 'active' | 'inactive' | 'on_leave';
    },
  ): Promise<Faculty> {
    return this.prisma.faculty.create({
      data: {
        tenantId,
        ...data,
      },
    });
  }

  async findById(tenantId: string, id: string): Promise<Faculty | null> {
    return this.prisma.faculty.findFirst({
      where: { tenantId, id },
    });
  }

  async findByUserId(tenantId: string, userId: string): Promise<Faculty | null> {
    return this.prisma.faculty.findFirst({
      where: { tenantId, userId },
    });
  }

  async findByDepartment(tenantId: string, department: string) {
    const [faculty, total] = await Promise.all([
      this.prisma.faculty.findMany({
        where: { tenantId, department },
        orderBy: { hireDate: 'desc' },
      }),
      this.prisma.faculty.count({
        where: { tenantId, department },
      }),
    ]);
    return { faculty, total };
  }

  async findByStatus(tenantId: string, status: string) {
    return this.prisma.faculty.findMany({
      where: { tenantId, status },
      orderBy: { hireDate: 'desc' },
    });
  }

  async findMany(tenantId: string, skip: number = 0, take: number = 20) {
    const [faculty, total] = await Promise.all([
      this.prisma.faculty.findMany({
        where: { tenantId },
        skip,
        take,
        orderBy: { hireDate: 'desc' },
      }),
      this.prisma.faculty.count({
        where: { tenantId },
      }),
    ]);
    return { faculty, total };
  }

  async update(id: string, data: Partial<Faculty>): Promise<Faculty> {
    return this.prisma.faculty.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });
  }

  async updateStatus(id: string, status: string): Promise<Faculty> {
    return this.prisma.faculty.update({
      where: { id },
      data: { status, updatedAt: new Date() },
    });
  }

  async getDepartmentCount(tenantId: string) {
    return this.prisma.faculty.groupBy({
      by: ['department'],
      where: { tenantId },
      _count: {
        id: true,
      },
    });
  }

  async getStatistics(tenantId: string) {
    const [total, active, byStatus] = await Promise.all([
      this.prisma.faculty.count({ where: { tenantId } }),
      this.prisma.faculty.count({ where: { tenantId, status: 'active' } }),
      this.prisma.faculty.groupBy({
        by: ['status'],
        where: { tenantId },
        _count: { id: true },
      }),
    ]);
    return { total, active, byStatus };
  }
}
