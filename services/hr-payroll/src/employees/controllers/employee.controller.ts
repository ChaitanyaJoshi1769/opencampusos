import { Controller, Get, Post, Put, Body, Param, Query, Headers } from '@nestjs/common';
import { EmployeeService } from '../services/employee.service';

@Controller('employees')
export class EmployeeController {
  constructor(private employeeService: EmployeeService) {}

  @Post()
  async createEmployee(@Body() data: any, @Headers('x-tenant-id') tenantId: string) {
    return this.employeeService.createEmployee(tenantId, data);
  }

  @Get()
  async listEmployees(@Query() filters: any, @Headers('x-tenant-id') tenantId: string) {
    return this.employeeService.listEmployees(tenantId, filters);
  }

  @Get('search')
  async searchEmployees(
    @Query('q') query: string,
    @Headers('x-tenant-id') tenantId: string,
  ) {
    return this.employeeService.searchEmployees(tenantId, query);
  }

  @Get('stats')
  async getStats(@Headers('x-tenant-id') tenantId: string) {
    return this.employeeService.getEmployeeStats(tenantId);
  }

  @Get('department/:department')
  async getByDepartment(
    @Param('department') department: string,
    @Headers('x-tenant-id') tenantId: string,
  ) {
    return this.employeeService.getEmployeesByDepartment(tenantId, department);
  }

  @Get(':id')
  async getEmployee(
    @Param('id') employeeId: string,
    @Headers('x-tenant-id') tenantId: string,
  ) {
    return this.employeeService.getEmployee(tenantId, employeeId);
  }

  @Put(':id')
  async updateEmployee(
    @Param('id') employeeId: string,
    @Body() data: any,
    @Headers('x-tenant-id') tenantId: string,
  ) {
    return this.employeeService.updateEmployee(tenantId, employeeId, data);
  }

  @Post(':id/terminate')
  async terminateEmployee(
    @Param('id') employeeId: string,
    @Body() body: { reason: string; lastDay: Date },
    @Headers('x-tenant-id') tenantId: string,
  ) {
    return this.employeeService.terminateEmployee(tenantId, employeeId, body.reason, new Date(body.lastDay));
  }

  @Put(':id/status')
  async updateStatus(
    @Param('id') employeeId: string,
    @Body() body: { status: string },
    @Headers('x-tenant-id') tenantId: string,
  ) {
    return this.employeeService.updateEmployeeStatus(tenantId, employeeId, body.status);
  }
}
