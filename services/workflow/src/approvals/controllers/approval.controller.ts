import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Headers,
  Query,
} from '@nestjs/common';
import { ApprovalService } from '../services/approval.service';

@Controller('approvals')
export class ApprovalController {
  constructor(private approvalService: ApprovalService) {}

  @Post()
  async createApprovalRequest(
    @Headers('x-tenant-id') tenantId: string,
    @Body() body: any,
  ) {
    return this.approvalService.createApprovalRequest(tenantId, body);
  }

  @Get(':requestId')
  async getApprovalRequest(
    @Headers('x-tenant-id') tenantId: string,
    @Param('requestId') requestId: string,
  ) {
    return this.approvalService.getApprovalRequest(tenantId, requestId);
  }

  @Get()
  async listPendingApprovals(
    @Headers('x-tenant-id') tenantId: string,
    @Query('approver') approver?: string,
  ) {
    return this.approvalService.listPendingApprovals(tenantId, approver);
  }

  @Post(':requestId/approve')
  async approveRequest(
    @Headers('x-tenant-id') tenantId: string,
    @Headers('x-user-id') userId: string,
    @Param('requestId') requestId: string,
    @Body() body: { notes?: string },
  ) {
    return this.approvalService.approveRequest(tenantId, requestId, userId, body.notes);
  }

  @Post(':requestId/reject')
  async rejectRequest(
    @Headers('x-tenant-id') tenantId: string,
    @Headers('x-user-id') userId: string,
    @Param('requestId') requestId: string,
    @Body() body: { reason: string },
  ) {
    return this.approvalService.rejectRequest(tenantId, requestId, userId, body.reason);
  }

  @Get('stats')
  async getStats(
    @Headers('x-tenant-id') tenantId: string,
  ) {
    return this.approvalService.getApprovalStats(tenantId);
  }

  @Get('entity/:entityId/history')
  async getHistory(
    @Headers('x-tenant-id') tenantId: string,
    @Param('entityId') entityId: string,
  ) {
    return this.approvalService.getApprovalHistory(tenantId, entityId);
  }
}
