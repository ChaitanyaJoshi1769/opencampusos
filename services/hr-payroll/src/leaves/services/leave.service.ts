import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class LeaveService {
  constructor(private prisma: PrismaService) {}

  async requestLeave(tenantId: string, employeeId: string, data: any) {
    return this.prisma.leaveRecord.create({
      data: {
        tenantId,
        employeeId,
        ...data,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        status: 'pending',
      },
    });
  }

  async getLeaveRecord(tenantId: string, leaveId: string) {
    return this.prisma.leaveRecord.findFirst({
      where: { id: leaveId, tenantId },
    });
  }

  async listLeaveRequests(tenantId: string, filters?: any) {
    return this.prisma.leaveRecord.findMany({
      where: {
        tenantId,
        ...(filters?.employeeId && { employeeId: filters.employeeId }),
        ...(filters?.status && { status: filters.status }),
      },
      orderBy: { startDate: 'asc' },
    });
  }

  async approveLeave(tenantId: string, leaveId: string, approverName: string) {
    return this.prisma.leaveRecord.update({
      where: { id: leaveId },
      data: { status: 'approved', approvedBy: approverName, approvedAt: new Date() },
    });
  }

  async rejectLeave(tenantId: string, leaveId: string, reason: string) {
    return this.prisma.leaveRecord.update({
      where: { id: leaveId },
      data: { status: 'rejected', rejectionReason: reason },
    });
  }

  async getEmployeeLeaveBalance(tenantId: string, employeeId: string, leaveType: string) {
    const records = await this.prisma.leaveRecord.findMany({
      where: { tenantId, employeeId, leaveType, status: 'approved' },
    });

    const totalDays = records.reduce((sum, r) => {
      const days = Math.ceil(
        (new Date(r.endDate).getTime() - new Date(r.startDate).getTime()) / (1000 * 60 * 60 * 24),
      );
      return sum + days;
    }, 0);

    return {
      employeeId,
      leaveType,
      totalDaysUsed: totalDays,
      balanceRemaining: 20 - totalDays,
    };
  }

  async getLeaveStats(tenantId: string) {
    const total = await this.prisma.leaveRecord.count({ where: { tenantId } });
    const approved = await this.prisma.leaveRecord.count({
      where: { tenantId, status: 'approved' },
    });
    const pending = await this.prisma.leaveRecord.count({
      where: { tenantId, status: 'pending' },
    });
    const rejected = await this.prisma.leaveRecord.count({
      where: { tenantId, status: 'rejected' },
    });

    return { total, approved, pending, rejected };
  }
}
