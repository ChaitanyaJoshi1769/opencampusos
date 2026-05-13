import { Controller, Get, Post, Put, Delete, Body, Param, Headers } from '@nestjs/common';
import { DepartmentService } from '../services/department.service';

@Controller('departments')
export class DepartmentController {
  constructor(private deptService: DepartmentService) {}

  @Post()
  async createDepartment(@Body() data: any, @Headers('x-tenant-id') tenantId: string) {
    return this.deptService.createDepartment(tenantId, data);
  }

  @Get()
  async listDepartments(@Headers('x-tenant-id') tenantId: string) {
    return this.deptService.listDepartments(tenantId);
  }

  @Get('stats')
  async getStats(@Headers('x-tenant-id') tenantId: string) {
    return this.deptService.getDepartmentStats(tenantId);
  }

  @Get(':id')
  async getDepartment(
    @Param('id') deptId: string,
    @Headers('x-tenant-id') tenantId: string,
  ) {
    return this.deptService.getDepartment(tenantId, deptId);
  }

  @Put(':id')
  async updateDepartment(
    @Param('id') deptId: string,
    @Body() data: any,
    @Headers('x-tenant-id') tenantId: string,
  ) {
    return this.deptService.updateDepartment(tenantId, deptId, data);
  }

  @Delete(':id')
  async deleteDepartment(
    @Param('id') deptId: string,
    @Headers('x-tenant-id') tenantId: string,
  ) {
    return this.deptService.deleteDepartment(tenantId, deptId);
  }
}
