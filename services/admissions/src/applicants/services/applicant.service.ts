import { Injectable, BadRequestException, Logger, NotFoundException } from '@nestjs/common';
import { Applicant } from '@prisma/client';
import { ApplicantRepository } from '../repositories/applicant.repository';

export interface CreateApplicantDto {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth?: Date;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}

@Injectable()
export class ApplicantService {
  private readonly logger = new Logger(ApplicantService.name);

  constructor(private readonly repository: ApplicantRepository) {}

  async createApplicant(tenantId: string, dto: CreateApplicantDto): Promise<Applicant> {
    const existing = await this.repository.findByEmail(tenantId, dto.email);
    if (existing) {
      throw new BadRequestException('Applicant with this email already exists');
    }

    const applicant = await this.repository.create(tenantId, dto);

    this.logger.log(`✅ Created applicant: ${applicant.id} - ${applicant.firstName} ${applicant.lastName}`);

    return applicant;
  }

  async getApplicant(tenantId: string, applicantId: string): Promise<Applicant> {
    const applicant = await this.repository.findById(tenantId, applicantId);

    if (!applicant) {
      throw new NotFoundException(`Applicant ${applicantId} not found`);
    }

    return applicant;
  }

  async listApplicants(tenantId: string, skip: number = 0, take: number = 20) {
    return this.repository.findMany(tenantId, skip, take);
  }

  async getApplicantsByStatus(tenantId: string, status: string) {
    return this.repository.findByStatus(tenantId, status);
  }

  async searchApplicants(tenantId: string, query: string): Promise<Applicant[]> {
    return this.repository.searchByName(tenantId, query);
  }

  async updateApplicant(
    tenantId: string,
    applicantId: string,
    dto: Partial<CreateApplicantDto>,
  ): Promise<Applicant> {
    const applicant = await this.getApplicant(tenantId, applicantId);

    const updated = await this.repository.update(applicantId, dto);
    this.logger.log(`✅ Updated applicant: ${applicantId}`);

    return updated;
  }

  async updateApplicantStatus(
    tenantId: string,
    applicantId: string,
    status: string,
  ): Promise<Applicant> {
    const applicant = await this.getApplicant(tenantId, applicantId);

    const validStatuses = ['new', 'reviewing', 'accepted', 'rejected', 'deferred', 'enrolled'];
    if (!validStatuses.includes(status)) {
      throw new BadRequestException('Invalid applicant status');
    }

    const updated = await this.repository.updateStatus(applicantId, status);
    this.logger.log(`✅ Updated applicant status: ${applicantId} → ${status}`);

    return updated;
  }

  async getStatistics(tenantId: string) {
    return this.repository.getStatistics(tenantId);
  }

  async deleteApplicant(tenantId: string, applicantId: string): Promise<Applicant> {
    const applicant = await this.getApplicant(tenantId, applicantId);

    const deleted = await this.repository.deleteApplicant(applicantId);
    this.logger.log(`✅ Deleted applicant: ${applicantId}`);

    return deleted;
  }
}
