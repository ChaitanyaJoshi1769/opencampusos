import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Employee } from '@prisma/client';

@Injectable()
export class EmployeeRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    tenantId: string,
    data: {
      userId: string;
      department: string;
      position: string;
      employmentType: string;
      salary: number;
      hireDate: Date;
      status: 'active' | 'inactive' | 'on_leave';
      reportsTo?: string;
      officeLocation?: string;
    },
  ): Promise<Employee> {
    return this.prisma.employee.create({
      data: {
        tenantId,
        ...data,
      },
    });
  }

  async findById(tenantId: string, id: string): Promise<Employee | null> {
    return this.prisma.employee.findFirst({
      where: { tenantId, id },
    });
  }

  async findByUserId(tenantId: string, userId: string): Promise<Employee | null> {
    return this.prisma.employee.findFirst({
      where: { tenantId, userId },
    });
  }

  async findByDepartment(tenantId: string, department: string) {
    const [employees, total] = await Promise.all([
      this.prisma.employee.findMany({
        where: { tenantId, department },
        orderBy: { hireDate: 'desc' },
      }),
      this.prisma.employee.count({
        where: { tenantId, department },
      }),
    ]);
    return { employees, total };
  }

  async findByStatus(tenantId: string, status: string) {
    return this.prisma.employee.findMany({
      where: { tenantId, status },
      orderBy: { hireDate: 'desc' },
    });
  }

  async findMany(tenantId: string, skip: number = 0, take: number = 20) {
    const [employees, total] = await Promise.all([
      this.prisma.employee.findMany({
        where: { tenantId },
        skip,
        take,
        orderBy: { hireDate: 'desc' },
      }),
      this.prisma.employee.count({
        where: { tenantId },
      }),
    ]);
    return { employees, total };
  }

  async findDirectReports(tenantId: string, managerId: string) {
    return this.prisma.employee.findMany({
      where: { tenantId, reportsTo: managerId },
      orderBy: { hireDate: 'desc' },
    });
  }

  async update(id: string, data: Partial<Employee>): Promise<Employee> {
    return this.prisma.employee.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });
  }

  async updateStatus(id: string, status: string): Promise<Employee> {
    return this.prisma.employee.update({
      where: { id },
      data: { status, updatedAt: new Date() },
    });
  }

  async getDepartmentStats(tenantId: string) {
    return this.prisma.employee.groupBy({
      by: ['department'],
      where: { tenantId },
      _count: { id: true },
      _avg: { salary: true },
    });
  }

  async getStatistics(tenantId: string) {
    const [total, active, byStatus] = await Promise.all([
      this.prisma.employee.count({ where: { tenantId } }),
      this.prisma.employee.count({ where: { tenantId, status: 'active' } }),
      this.prisma.employee.groupBy({
        by: ['status'],
        where: { tenantId },
        _count: { id: true },
      }),
    ]);
    return { total, active, byStatus };
  }
}
