import { Controller, Get, Post, Patch, Body, Param, Query, HttpCode } from '@nestjs/common';
import { FacultyService, CreateFacultyDto } from '../services/faculty.service';
import { Faculty } from '@prisma/client';

@Controller('v1/faculty')
export class FacultyController {
  constructor(private readonly service: FacultyService) {}

  @Post()
  @HttpCode(201)
  async create(@Body() dto: CreateFacultyDto): Promise<{ status: string; data: Faculty }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const faculty = await this.service.createFaculty(tenantId, dto);

    return { status: 'success', data: faculty };
  }

  @Get()
  @HttpCode(200)
  async list(
    @Query('skip') skip: number = 0,
    @Query('take') take: number = 20,
  ): Promise<{ status: string; data: { faculty: Faculty[]; total: number } }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const result = await this.service.listFaculty(tenantId, skip, take);

    return { status: 'success', data: result };
  }

  @Get('department/:department')
  @HttpCode(200)
  async getByDepartment(
    @Param('department') department: string,
  ): Promise<{ status: string; data: { faculty: Faculty[]; total: number } }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const result = await this.service.getFacultyByDepartment(tenantId, department);

    return { status: 'success', data: result };
  }

  @Get('status/:status')
  @HttpCode(200)
  async getByStatus(
    @Param('status') status: string,
  ): Promise<{ status: string; data: Faculty[] }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const faculty = await this.service.getFacultyByStatus(tenantId, status);

    return { status: 'success', data: faculty };
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
  async getFaculty(
    @Param('id') id: string,
  ): Promise<{ status: string; data: Faculty }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const faculty = await this.service.getFaculty(tenantId, id);

    return { status: 'success', data: faculty };
  }

  @Patch(':id')
  @HttpCode(200)
  async update(
    @Param('id') id: string,
    @Body() dto: Partial<CreateFacultyDto>,
  ): Promise<{ status: string; data: Faculty }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const faculty = await this.service.updateFaculty(tenantId, id, dto);

    return { status: 'success', data: faculty };
  }

  @Patch(':id/status')
  @HttpCode(200)
  async updateStatus(
    @Param('id') id: string,
    @Body() body: { status: string },
  ): Promise<{ status: string; data: Faculty }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const faculty = await this.service.updateFacultyStatus(tenantId, id, body.status);

    return { status: 'success', data: faculty };
  }
}
