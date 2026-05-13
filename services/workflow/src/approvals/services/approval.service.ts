import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ApprovalService {
  private logger = new Logger(ApprovalService.name);

  constructor(private prisma: PrismaService) {}

  async createApprovalRequest(tenantId: string, data: any) {
    this.logger.log(`Creating approval request for ${data.entityType}`);

    return this.prisma.approvalRequest.create({
      data: {
        ...data,
        tenantId,
        status: 'pending',
      },
    });
  }

  async getApprovalRequest(tenantId: string, requestId: string) {
    const request = await this.prisma.approvalRequest.findFirst({
      where: {
        id: requestId,
        tenantId,
      },
      include: {
        approvals: true,
      },
    });

    if (!request) {
      throw new NotFoundException('Approval request not found');
    }

    return request;
  }

  async listPendingApprovals(tenantId: string, approver?: string) {
    const where: any = {
      tenantId,
      status: 'pending',
    };

    const requests = await this.prisma.approvalRequest.findMany({
      where,
      include: { approvals: true },
      orderBy: { createdAt: 'asc' },
    });

    if (approver) {
      return requests.filter((r) =>
        r.approvals.some((a) => a.approver === approver && a.status === 'pending'),
      );
    }

    return requests;
  }

  async approveRequest(tenantId: string, requestId: string, approverId: string, notes?: string) {
    const request = await this.getApprovalRequest(tenantId, requestId);

    const approval = await this.prisma.approval.create({
      data: {
        approvalRequestId: request.id,
        approver: approverId,
        status: 'approved',
        approvedAt: new Date(),
        notes,
      },
    });

    const allApprovals = await this.prisma.approval.findMany({
      where: { approvalRequestId: request.id },
    });

    const allApproved = allApprovals.every((a) => a.status === 'approved');

    if (allApproved) {
      await this.prisma.approvalRequest.update({
        where: { id: request.id },
        data: { status: 'approved', approvedAt: new Date() },
      });
    }

    return approval;
  }

  async rejectRequest(tenantId: string, requestId: string, approverId: string, reason: string) {
    const request = await this.getApprovalRequest(tenantId, requestId);

    const approval = await this.prisma.approval.create({
      data: {
        approvalRequestId: request.id,
        approver: approverId,
        status: 'rejected',
        rejectedAt: new Date(),
        notes: reason,
      },
    });

    await this.prisma.approvalRequest.update({
      where: { id: request.id },
      data: { status: 'rejected', rejectedAt: new Date() },
    });

    return approval;
  }

  async getApprovalStats(tenantId: string) {
    const requests = await this.prisma.approvalRequest.findMany({
      where: { tenantId },
    });

    const pending = requests.filter((r) => r.status === 'pending').length;
    const approved = requests.filter((r) => r.status === 'approved').length;
    const rejected = requests.filter((r) => r.status === 'rejected').length;

    return {
      totalRequests: requests.length,
      pending,
      approved,
      rejected,
      approvalRate: requests.length > 0 ? (approved / requests.length) * 100 : 0,
    };
  }

  async getApprovalHistory(tenantId: string, entityId: string) {
    return this.prisma.approvalRequest.findMany({
      where: {
        tenantId,
        entityId,
      },
      include: { approvals: true },
      orderBy: { createdAt: 'desc' },
    });
  }
}
