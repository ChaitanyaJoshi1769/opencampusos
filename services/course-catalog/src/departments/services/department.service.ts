import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DepartmentService {
  constructor(private prisma: PrismaService) {}

  async createDepartment(tenantId: string, data: any) {
    return this.prisma.department.create({
      data: { ...data, tenantId },
    });
  }

  async getDepartment(tenantId: string, deptId: string) {
    return this.prisma.department.findFirst({
      where: { id: deptId, tenantId },
      include: { courses: { take: 10 } },
    });
  }

  async listDepartments(tenantId: string) {
    return this.prisma.department.findMany({
      where: { tenantId },
      include: { _count: { select: { courses: true } } },
    });
  }

  async updateDepartment(tenantId: string, deptId: string, data: any) {
    return this.prisma.department.update({
      where: { id: deptId },
      data,
    });
  }

  async deleteDepartment(tenantId: string, deptId: string) {
    return this.prisma.department.delete({
      where: { id: deptId },
    });
  }

  async getDepartmentStats(tenantId: string) {
    const departments = await this.prisma.department.findMany({
      where: { tenantId },
      include: { _count: { select: { courses: true } } },
    });
    return {
      total: departments.length,
      departments: departments.map(d => ({
        id: d.id,
        code: d.code,
        name: d.name,
        courseCount: d._count.courses,
      })),
    };
  }
}
