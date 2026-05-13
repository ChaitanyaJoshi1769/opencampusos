import { Controller, Get, Post, Body, Param, Query, HttpCode } from '@nestjs/common';
import { GradingService, CreateAssignmentDto, SubmitGradeDto } from '../services/grading.service';

@Controller('v1/grading')
export class GradingController {
  constructor(private readonly service: GradingService) {}

  @Post('assignments')
  @HttpCode(201)
  async createAssignment(@Body() dto: CreateAssignmentDto): Promise<{ status: string; data: any }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const assignment = await this.service.createAssignment(tenantId, dto);

    return { status: 'success', data: assignment };
  }

  @Get('assignments/:id')
  @HttpCode(200)
  async getAssignment(@Param('id') id: string): Promise<{ status: string; data: any }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const assignment = await this.service.getAssignment(tenantId, id);

    return { status: 'success', data: assignment };
  }

  @Get('assignments')
  @HttpCode(200)
  async listAssignments(@Query('courseId') courseId: string): Promise<{ status: string; data: any[] }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const assignments = await this.service.listAssignmentsByCourse(tenantId, courseId);

    return { status: 'success', data: assignments };
  }

  @Post('grades')
  @HttpCode(201)
  async submitGrade(@Body() dto: SubmitGradeDto): Promise<{ status: string; data: any }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const grade = await this.service.submitGrade(tenantId, dto);

    return { status: 'success', data: grade };
  }

  @Get('student-grades')
  @HttpCode(200)
  async getStudentGrades(
    @Query('courseId') courseId: string,
    @Query('studentId') studentId: string,
  ): Promise<{ status: string; data: any[] }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const grades = await this.service.getStudentGrades(tenantId, courseId, studentId);

    return { status: 'success', data: grades };
  }

  @Get('course-grade')
  @HttpCode(200)
  async getCourseGrade(
    @Query('courseId') courseId: string,
    @Query('studentId') studentId: string,
  ): Promise<{ status: string; data: any }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const grade = await this.service.calculateCourseGrade(tenantId, courseId, studentId);

    return { status: 'success', data: grade };
  }
}
