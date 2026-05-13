import { Controller, Get, Post, Patch, Body, Param, Query, HttpCode } from '@nestjs/common';
import { ApplicationService, CreateApplicationDto } from '../services/application.service';
import { Application } from '@prisma/client';

@Controller('v1/applications')
export class ApplicationController {
  constructor(private readonly service: ApplicationService) {}

  @Post()
  @HttpCode(201)
  async create(@Body() dto: CreateApplicationDto): Promise<{ status: string; data: Application }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const application = await this.service.createApplication(tenantId, dto);

    return { status: 'success', data: application };
  }

  @Get()
  @HttpCode(200)
  async list(
    @Query('skip') skip: number = 0,
    @Query('take') take: number = 20,
  ): Promise<{ status: string; data: { applications: Application[]; total: number } }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const result = await this.service.listApplications(tenantId, skip, take);

    return { status: 'success', data: result };
  }

  @Get('applicant/:applicantId')
  @HttpCode(200)
  async getByApplicant(
    @Param('applicantId') applicantId: string,
  ): Promise<{ status: string; data: { applications: Application[]; total: number } }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const result = await this.service.getApplicationsByApplicant(tenantId, applicantId);

    return { status: 'success', data: result };
  }

  @Get('program/:programId')
  @HttpCode(200)
  async getByProgram(
    @Param('programId') programId: string,
  ): Promise<{ status: string; data: { applications: Application[]; total: number } }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const result = await this.service.getApplicationsByProgram(tenantId, programId);

    return { status: 'success', data: result };
  }

  @Get('status/:status')
  @HttpCode(200)
  async getByStatus(
    @Param('status') status: string,
  ): Promise<{ status: string; data: { applications: Application[]; total: number } }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const result = await this.service.getApplicationsByStatus(tenantId, status);

    return { status: 'success', data: result };
  }

  @Get('term/:term')
  @HttpCode(200)
  async getByTerm(
    @Param('term') term: string,
  ): Promise<{ status: string; data: Application[] }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const applications = await this.service.getApplicationsByTerm(tenantId, term);

    return { status: 'success', data: applications };
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
  async getApplication(
    @Param('id') id: string,
  ): Promise<{ status: string; data: Application }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const application = await this.service.getApplication(tenantId, id);

    return { status: 'success', data: application };
  }

  @Patch(':id')
  @HttpCode(200)
  async update(
    @Param('id') id: string,
    @Body() dto: Partial<CreateApplicationDto>,
  ): Promise<{ status: string; data: Application }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const application = await this.service.updateApplication(tenantId, id, dto);

    return { status: 'success', data: application };
  }

  @Patch(':id/status')
  @HttpCode(200)
  async updateStatus(
    @Param('id') id: string,
    @Body() body: { status: string },
  ): Promise<{ status: string; data: Application }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const application = await this.service.updateApplicationStatus(tenantId, id, body.status);

    return { status: 'success', data: application };
  }
}
