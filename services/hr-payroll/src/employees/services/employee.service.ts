import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class EmployeeService {
  constructor(private prisma: PrismaService) {}

  async createEmployee(tenantId: string, data: any) {
    return this.prisma.employee.create({
      data: { ...data, tenantId, status: 'active' },
    });
  }

  async getEmployee(tenantId: string, employeeId: string) {
    return this.prisma.employee.findFirst({
      where: { id: employeeId, tenantId },
      include: { payroll: { take: 5 }, benefits: true, leaveRecords: { take: 5 } },
    });
  }

  async listEmployees(tenantId: string, filters?: any) {
    return this.prisma.employee.findMany({
      where: {
        tenantId,
        ...(filters?.department && { department: filters.department }),
        ...(filters?.status && { status: filters.status }),
        ...(filters?.employmentType && { employmentType: filters.employmentType }),
      },
      include: { _count: { select: { payroll: true, benefits: true } } },
      skip: filters?.skip || 0,
      take: filters?.take || 20,
    });
  }

  async updateEmployee(tenantId: string, employeeId: string, data: any) {
    return this.prisma.employee.update({
      where: { id: employeeId },
      data,
    });
  }

  async terminateEmployee(tenantId: string, employeeId: string, reason: string, lastDay: Date) {
    return this.prisma.employee.update({
      where: { id: employeeId },
      data: { status: 'terminated', terminationReason: reason, lastDay },
    });
  }

  async getEmployeesByDepartment(tenantId: string, department: string) {
    return this.prisma.employee.findMany({
      where: { tenantId, department, status: 'active' },
      orderBy: { lastName: 'asc' },
    });
  }

  async getEmployeeByEmailOrId(tenantId: string, identifier: string) {
    return this.prisma.employee.findFirst({
      where: {
        tenantId,
        OR: [{ email: identifier }, { employeeNumber: identifier }, { userId: identifier }],
      },
    });
  }

  async getEmployeeStats(tenantId: string) {
    const total = await this.prisma.employee.count({ where: { tenantId } });
    const active = await this.prisma.employee.count({
      where: { tenantId, status: 'active' },
    });
    const terminated = await this.prisma.employee.count({
      where: { tenantId, status: 'terminated' },
    });
    const onLeave = await this.prisma.employee.count({
      where: { tenantId, status: 'on_leave' },
    });

    const byDepartment = await this.prisma.employee.groupBy({
      by: ['department'],
      where: { tenantId, status: 'active' },
      _count: { id: true },
    });

    return {
      total,
      active,
      terminated,
      onLeave,
      byDepartment: byDepartment.map(d => ({
        department: d.department,
        count: d._count.id,
      })),
    };
  }

  async updateEmployeeStatus(tenantId: string, employeeId: string, status: string) {
    return this.prisma.employee.update({
      where: { id: employeeId },
      data: { status },
    });
  }

  async searchEmployees(tenantId: string, query: string) {
    return this.prisma.employee.findMany({
      where: {
        tenantId,
        OR: [
          { firstName: { contains: query, mode: 'insensitive' } },
          { lastName: { contains: query, mode: 'insensitive' } },
          { email: { contains: query, mode: 'insensitive' } },
          { employeeNumber: { contains: query, mode: 'insensitive' } },
        ],
      },
      take: 10,
    });
  }
}
