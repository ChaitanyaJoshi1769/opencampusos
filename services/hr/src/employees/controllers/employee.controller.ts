import { Controller, Get, Post, Patch, Body, Param, Query, HttpCode } from '@nestjs/common';
import { EmployeeService, CreateEmployeeDto } from '../services/employee.service';
import { Employee } from '@prisma/client';

@Controller('v1/employees')
export class EmployeeController {
  constructor(private readonly service: EmployeeService) {}

  @Post()
  @HttpCode(201)
  async create(@Body() dto: CreateEmployeeDto): Promise<{ status: string; data: Employee }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const employee = await this.service.createEmployee(tenantId, dto);

    return { status: 'success', data: employee };
  }

  @Get()
  @HttpCode(200)
  async list(
    @Query('skip') skip: number = 0,
    @Query('take') take: number = 20,
  ): Promise<{ status: string; data: { employees: Employee[]; total: number } }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const result = await this.service.listEmployees(tenantId, skip, take);

    return { status: 'success', data: result };
  }

  @Get('department/:department')
  @HttpCode(200)
  async getByDepartment(
    @Param('department') department: string,
  ): Promise<{ status: string; data: { employees: Employee[]; total: number } }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const result = await this.service.getEmployeesByDepartment(tenantId, department);

    return { status: 'success', data: result };
  }

  @Get('status/:status')
  @HttpCode(200)
  async getByStatus(
    @Param('status') status: string,
  ): Promise<{ status: string; data: Employee[] }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const employees = await this.service.getEmployeesByStatus(tenantId, status);

    return { status: 'success', data: employees };
  }

  @Get('manager/:managerId/reports')
  @HttpCode(200)
  async getDirectReports(
    @Param('managerId') managerId: string,
  ): Promise<{ status: string; data: Employee[] }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const reports = await this.service.getDirectReports(tenantId, managerId);

    return { status: 'success', data: reports };
  }

  @Get('statistics')
  @HttpCode(200)
  async getStatistics(): Promise<{ status: string; data: any }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const stats = await this.service.getStatistics(tenantId);

    return { status: 'success', data: stats };
  }

  @Get(':id')
  @HttpCode(200)
  async getEmployee(
    @Param('id') id: string,
  ): Promise<{ status: string; data: Employee }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const employee = await this.service.getEmployee(tenantId, id);

    return { status: 'success', data: employee };
  }

  @Patch(':id')
  @HttpCode(200)
  async update(
    @Param('id') id: string,
    @Body() dto: Partial<CreateEmployeeDto>,
  ): Promise<{ status: string; data: Employee }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const employee = await this.service.updateEmployee(tenantId, id, dto);

    return { status: 'success', data: employee };
  }

  @Patch(':id/status')
  @HttpCode(200)
  async updateStatus(
    @Param('id') id: string,
    @Body() body: { status: string },
  ): Promise<{ status: string; data: Employee }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const employee = await this.service.updateEmployeeStatus(tenantId, id, body.status);

    return { status: 'success', data: employee };
  }
}
