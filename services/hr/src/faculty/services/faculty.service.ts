import { Injectable, BadRequestException, Logger, NotFoundException } from '@nestjs/common';
import { Faculty } from '@prisma/client';
import { FacultyRepository } from '../repositories/faculty.repository';

export interface CreateFacultyDto {
  userId: string;
  department: string;
  title: string;
  specialization?: string;
  officeLocation?: string;
  officeHours?: string;
  researchInterests?: string;
  hireDate: Date;
}

@Injectable()
export class FacultyService {
  private readonly logger = new Logger(FacultyService.name);

  constructor(private readonly repository: FacultyRepository) {}

  async createFaculty(tenantId: string, dto: CreateFacultyDto): Promise<Faculty> {
    const faculty = await this.repository.create(tenantId, {
      ...dto,
      status: 'active',
    });

    this.logger.log(`✅ Created faculty: ${faculty.id} - ${dto.title} in ${dto.department}`);

    return faculty;
  }

  async getFaculty(tenantId: string, facultyId: string): Promise<Faculty> {
    const faculty = await this.repository.findById(tenantId, facultyId);

    if (!faculty) {
      throw new NotFoundException(`Faculty ${facultyId} not found`);
    }

    return faculty;
  }

  async getFacultyByUser(tenantId: string, userId: string): Promise<Faculty> {
    const faculty = await this.repository.findByUserId(tenantId, userId);

    if (!faculty) {
      throw new NotFoundException(`Faculty with user ${userId} not found`);
    }

    return faculty;
  }

  async listFaculty(tenantId: string, skip: number = 0, take: number = 20) {
    return this.repository.findMany(tenantId, skip, take);
  }

  async getFacultyByDepartment(tenantId: string, department: string) {
    return this.repository.findByDepartment(tenantId, department);
  }

  async getFacultyByStatus(tenantId: string, status: string): Promise<Faculty[]> {
    return this.repository.findByStatus(tenantId, status);
  }

  async updateFaculty(tenantId: string, facultyId: string, dto: Partial<CreateFacultyDto>): Promise<Faculty> {
    const faculty = await this.getFaculty(tenantId, facultyId);

    const updated = await this.repository.update(facultyId, dto);
    this.logger.log(`✅ Updated faculty: ${facultyId}`);

    return updated;
  }

  async updateFacultyStatus(tenantId: string, facultyId: string, status: string): Promise<Faculty> {
    const faculty = await this.getFaculty(tenantId, facultyId);

    if (!['active', 'inactive', 'on_leave'].includes(status)) {
      throw new BadRequestException('Invalid status');
    }

    const updated = await this.repository.updateStatus(facultyId, status);
    this.logger.log(`✅ Updated faculty status: ${facultyId} → ${status}`);

    return updated;
  }

  async getDepartmentStats(tenantId: string) {
    return this.repository.getDepartmentCount(tenantId);
  }

  async getStatistics(tenantId: string) {
    return this.repository.getStatistics(tenantId);
  }
}
