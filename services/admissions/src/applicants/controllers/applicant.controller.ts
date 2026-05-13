import { Controller, Get, Post, Patch, Delete, Body, Param, Query, HttpCode } from '@nestjs/common';
import { ApplicantService, CreateApplicantDto } from '../services/applicant.service';
import { Applicant } from '@prisma/client';

@Controller('v1/applicants')
export class ApplicantController {
  constructor(private readonly service: ApplicantService) {}

  @Post()
  @HttpCode(201)
  async create(@Body() dto: CreateApplicantDto): Promise<{ status: string; data: Applicant }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const applicant = await this.service.createApplicant(tenantId, dto);

    return { status: 'success', data: applicant };
  }

  @Get()
  @HttpCode(200)
  async list(
    @Query('skip') skip: number = 0,
    @Query('take') take: number = 20,
  ): Promise<{ status: string; data: { applicants: Applicant[]; total: number } }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const result = await this.service.listApplicants(tenantId, skip, take);

    return { status: 'success', data: result };
  }

  @Get('search')
  @HttpCode(200)
  async search(
    @Query('q') query: string,
  ): Promise<{ status: string; data: Applicant[] }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const applicants = await this.service.searchApplicants(tenantId, query);

    return { status: 'success', data: applicants };
  }

  @Get('status/:status')
  @HttpCode(200)
  async getByStatus(
    @Param('status') status: string,
  ): Promise<{ status: string; data: { applicants: Applicant[]; total: number } }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const result = await this.service.getApplicantsByStatus(tenantId, status);

    return { status: 'success', data: result };
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
  async getApplicant(
    @Param('id') id: string,
  ): Promise<{ status: string; data: Applicant }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const applicant = await this.service.getApplicant(tenantId, id);

    return { status: 'success', data: applicant };
  }

  @Patch(':id')
  @HttpCode(200)
  async update(
    @Param('id') id: string,
    @Body() dto: Partial<CreateApplicantDto>,
  ): Promise<{ status: string; data: Applicant }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const applicant = await this.service.updateApplicant(tenantId, id, dto);

    return { status: 'success', data: applicant };
  }

  @Patch(':id/status')
  @HttpCode(200)
  async updateStatus(
    @Param('id') id: string,
    @Body() body: { status: string },
  ): Promise<{ status: string; data: Applicant }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const applicant = await this.service.updateApplicantStatus(tenantId, id, body.status);

    return { status: 'success', data: applicant };
  }

  @Delete(':id')
  @HttpCode(200)
  async delete(
    @Param('id') id: string,
  ): Promise<{ status: string; message: string }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    await this.service.deleteApplicant(tenantId, id);

    return { status: 'success', message: 'Applicant deleted successfully' };
  }
}
