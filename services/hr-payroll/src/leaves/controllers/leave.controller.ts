import { Controller, Get, Post, Body, Param, Query, Headers } from '@nestjs/common';
import { LeaveService } from '../services/leave.service';

@Controller('leaves')
export class LeaveController {
  constructor(private leaveService: LeaveService) {}

  @Post()
  async requestLeave(@Body() data: any, @Headers('x-tenant-id') tenantId: string) {
    return this.leaveService.requestLeave(tenantId, data.employeeId, data);
  }

  @Get()
  async listRequests(@Query() filters: any, @Headers('x-tenant-id') tenantId: string) {
    return this.leaveService.listLeaveRequests(tenantId, filters);
  }

  @Get('stats')
  async getStats(@Headers('x-tenant-id') tenantId: string) {
    return this.leaveService.getLeaveStats(tenantId);
  }

  @Get('balance/:employeeId')
  async getBalance(
    @Param('employeeId') employeeId: string,
    @Query('leaveType') leaveType: string,
    @Headers('x-tenant-id') tenantId: string,
  ) {
    return this.leaveService.getEmployeeLeaveBalance(tenantId, employeeId, leaveType);
  }

  @Get(':id')
  async getLeave(
    @Param('id') leaveId: string,
    @Headers('x-tenant-id') tenantId: string,
  ) {
    return this.leaveService.getLeaveRecord(tenantId, leaveId);
  }

  @Post(':id/approve')
  async approveLeave(
    @Param('id') leaveId: string,
    @Body() body: { approverName: string },
    @Headers('x-tenant-id') tenantId: string,
  ) {
    return this.leaveService.approveLeave(tenantId, leaveId, body.approverName);
  }

  @Post(':id/reject')
  async rejectLeave(
    @Param('id') leaveId: string,
    @Body() body: { reason: string },
    @Headers('x-tenant-id') tenantId: string,
  ) {
    return this.leaveService.rejectLeave(tenantId, leaveId, body.reason);
  }
}
