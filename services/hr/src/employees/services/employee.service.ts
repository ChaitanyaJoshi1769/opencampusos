import { Injectable, BadRequestException, Logger, NotFoundException } from '@nestjs/common';
import { Employee } from '@prisma/client';
import { EmployeeRepository } from '../repositories/employee.repository';

export interface CreateEmployeeDto {
  userId: string;
  department: string;
  position: string;
  employmentType: 'full_time' | 'part_time' | 'contract' | 'temporary';
  salary: number;
  hireDate: Date;
  reportsTo?: string;
  officeLocation?: string;
}

@Injectable()
export class EmployeeService {
  private readonly logger = new Logger(EmployeeService.name);

  constructor(private readonly repository: EmployeeRepository) {}

  async createEmployee(tenantId: string, dto: CreateEmployeeDto): Promise<Employee> {
    if (dto.salary < 0) {
      throw new BadRequestException('Salary cannot be negative');
    }

    const employee = await this.repository.create(tenantId, {
      ...dto,
      status: 'active',
    });

    this.logger.log(`✅ Created employee: ${employee.id} - ${dto.position} in ${dto.department}`);

    return employee;
  }

  async getEmployee(tenantId: string, employeeId: string): Promise<Employee> {
    const employee = await this.repository.findById(tenantId, employeeId);

    if (!employee) {
      throw new NotFoundException(`Employee ${employeeId} not found`);
    }

    return employee;
  }

  async getEmployeeByUser(tenantId: string, userId: string): Promise<Employee> {
    const employee = await this.repository.findByUserId(tenantId, userId);

    if (!employee) {
      throw new NotFoundException(`Employee with user ${userId} not found`);
    }

    return employee;
  }

  async listEmployees(tenantId: string, skip: number = 0, take: number = 20) {
    return this.repository.findMany(tenantId, skip, take);
  }

  async getEmployeesByDepartment(tenantId: string, department: string) {
    return this.repository.findByDepartment(tenantId, department);
  }

  async getEmployeesByStatus(tenantId: string, status: string): Promise<Employee[]> {
    return this.repository.findByStatus(tenantId, status);
  }

  async getDirectReports(tenantId: string, managerId: string): Promise<Employee[]> {
    return this.repository.findDirectReports(tenantId, managerId);
  }

  async updateEmployee(tenantId: string, employeeId: string, dto: Partial<CreateEmployeeDto>): Promise<Employee> {
    const employee = await this.getEmployee(tenantId, employeeId);

    const updated = await this.repository.update(employeeId, dto);
    this.logger.log(`✅ Updated employee: ${employeeId}`);

    return updated;
  }

  async updateEmployeeStatus(tenantId: string, employeeId: string, status: string): Promise<Employee> {
    const employee = await this.getEmployee(tenantId, employeeId);

    if (!['active', 'inactive', 'on_leave'].includes(status)) {
      throw new BadRequestException('Invalid status');
    }

    const updated = await this.repository.updateStatus(employeeId, status);
    this.logger.log(`✅ Updated employee status: ${employeeId} → ${status}`);

    return updated;
  }

  async getDepartmentStats(tenantId: string) {
    return this.repository.getDepartmentStats(tenantId);
  }

  async getStatistics(tenantId: string) {
    return this.repository.getStatistics(tenantId);
  }
}
