import { Injectable, BadRequestException, Logger, NotFoundException } from '@nestjs/common';
import { Application } from '@prisma/client';
import { ApplicationRepository } from '../repositories/application.repository';

export interface CreateApplicationDto {
  applicantId: string;
  programId: string;
  academicTerm: string;
  gpa?: number;
  testScore?: number;
  notes?: string;
}

@Injectable()
export class ApplicationService {
  private readonly logger = new Logger(ApplicationService.name);

  constructor(private readonly repository: ApplicationRepository) {}

  async createApplication(tenantId: string, dto: CreateApplicationDto): Promise<Application> {
    if (dto.gpa && (dto.gpa < 0 || dto.gpa > 4.0)) {
      throw new BadRequestException('GPA must be between 0 and 4.0');
    }

    const application = await this.repository.create(tenantId, {
      ...dto,
      submissionDate: new Date(),
    });

    this.logger.log(`✅ Created application: ${application.id} for applicant ${dto.applicantId}`);

    return application;
  }

  async getApplication(tenantId: string, applicationId: string): Promise<Application> {
    const application = await this.repository.findById(tenantId, applicationId);

    if (!application) {
      throw new NotFoundException(`Application ${applicationId} not found`);
    }

    return application;
  }

  async listApplications(tenantId: string, skip: number = 0, take: number = 20) {
    return this.repository.findMany(tenantId, skip, take);
  }

  async getApplicationsByApplicant(tenantId: string, applicantId: string) {
    return this.repository.findByApplicant(tenantId, applicantId);
  }

  async getApplicationsByProgram(tenantId: string, programId: string) {
    return this.repository.findByProgram(tenantId, programId);
  }

  async getApplicationsByStatus(tenantId: string, status: string) {
    return this.repository.findByStatus(tenantId, status);
  }

  async getApplicationsByTerm(tenantId: string, academicTerm: string): Promise<Application[]> {
    return this.repository.findApplicationsInTerm(tenantId, academicTerm);
  }

  async updateApplication(
    tenantId: string,
    applicationId: string,
    dto: Partial<CreateApplicationDto>,
  ): Promise<Application> {
    const application = await this.getApplication(tenantId, applicationId);

    if (dto.gpa && (dto.gpa < 0 || dto.gpa > 4.0)) {
      throw new BadRequestException('GPA must be between 0 and 4.0');
    }

    const updated = await this.repository.update(applicationId, dto);
    this.logger.log(`✅ Updated application: ${applicationId}`);

    return updated;
  }

  async updateApplicationStatus(
    tenantId: string,
    applicationId: string,
    status: string,
  ): Promise<Application> {
    const application = await this.getApplication(tenantId, applicationId);

    const validStatuses = ['submitted', 'under_review', 'accepted', 'rejected', 'deferred'];
    if (!validStatuses.includes(status)) {
      throw new BadRequestException('Invalid application status');
    }

    const updated = await this.repository.updateStatus(applicationId, status);
    this.logger.log(`✅ Updated application status: ${applicationId} → ${status}`);

    return updated;
  }

  async getStatistics(tenantId: string) {
    return this.repository.getStatistics(tenantId);
  }
}
