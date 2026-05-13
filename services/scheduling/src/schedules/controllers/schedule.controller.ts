import { Controller, Get, Post, Body, Param, Query, HttpCode } from '@nestjs/common';
import { ScheduleService, CreateClassScheduleDto } from '../services/schedule.service';

@Controller('v1/schedules')
export class ScheduleController {
  constructor(private readonly service: ScheduleService) {}

  @Post()
  @HttpCode(201)
  async createSchedule(@Body() dto: CreateClassScheduleDto): Promise<{ status: string; data: any }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const schedule = await this.service.createClassSchedule(tenantId, dto);

    return { status: 'success', data: schedule };
  }

  @Get(':id')
  @HttpCode(200)
  async getSchedule(@Param('id') id: string): Promise<{ status: string; data: any }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const schedule = await this.service.getSchedule(tenantId, id);

    return { status: 'success', data: schedule };
  }

  @Get()
  @HttpCode(200)
  async listSchedules(@Query('courseId') courseId?: string, @Query('instructorId') instructorId?: string): Promise<{ status: string; data: any[] }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const schedules = await this.service.listSchedules(tenantId, courseId, instructorId);

    return { status: 'success', data: schedules };
  }

  @Get('instructor/:instructorId')
  @HttpCode(200)
  async getInstructorSchedule(@Param('instructorId') instructorId: string): Promise<{ status: string; data: any[] }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const schedules = await this.service.getInstructorSchedule(tenantId, instructorId);

    return { status: 'success', data: schedules };
  }

  @Get('student/:studentId')
  @HttpCode(200)
  async getStudentSchedule(@Param('studentId') studentId: string): Promise<{ status: string; data: any[] }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const schedules = await this.service.getStudentSchedule(tenantId, studentId);

    return { status: 'success', data: schedules };
  }

  @Post('check-conflicts')
  @HttpCode(200)
  async checkConflicts(@Body() dto: CreateClassScheduleDto): Promise<{ status: string; data: any[] }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const conflicts = await this.service.checkScheduleConflicts(tenantId, dto);

    return { status: 'success', data: conflicts };
  }

  @Post('bulk-generate')
  @HttpCode(201)
  async bulkGenerate(@Body() body: { schedules: CreateClassScheduleDto[] }): Promise<{ status: string; data: any }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const result = await this.service.generateBulkSchedule(tenantId, body.schedules);

    return { status: 'success', data: result };
  }

  @Post('publish/:termId')
  @HttpCode(200)
  async publishSchedule(@Param('termId') termId: string): Promise<{ status: string; data: any }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const result = await this.service.publishSchedule(tenantId, termId);

    return { status: 'success', data: result };
  }

  @Get('statistics')
  @HttpCode(200)
  async getStatistics(@Query('termId') termId?: string): Promise<{ status: string; data: any }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const stats = await this.service.getScheduleStatistics(tenantId, termId);

    return { status: 'success', data: stats };
  }
}
