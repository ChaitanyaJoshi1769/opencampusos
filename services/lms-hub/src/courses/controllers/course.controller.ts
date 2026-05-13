import { Controller, Get, Post, Body, Param, HttpCode } from '@nestjs/common';
import { CourseService } from '../services/course.service';

@Controller('v1/courses')
export class CourseController {
  constructor(private readonly service: CourseService) {}

  @Post()
  @HttpCode(201)
  async create(@Body() dto: any): Promise<{ status: string; data: any }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const course = await this.service.createCourse(tenantId, dto);

    return { status: 'success', data: course };
  }

  @Get()
  @HttpCode(200)
  async list(): Promise<{ status: string; data: any[] }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const courses = await this.service.listCourses(tenantId);

    return { status: 'success', data: courses };
  }

  @Get(':id')
  @HttpCode(200)
  async getCourse(
    @Param('id') id: string,
  ): Promise<{ status: string; data: any }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const course = await this.service.getCourse(tenantId, id);

    return { status: 'success', data: course };
  }

  @Get(':id/enrollments')
  @HttpCode(200)
  async getEnrollments(
    @Param('id') id: string,
  ): Promise<{ status: string; data: any[] }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const enrollments = await this.service.getEnrollments(tenantId, id);

    return { status: 'success', data: enrollments };
  }

  @Post(':id/enroll')
  @HttpCode(200)
  async enrollStudent(
    @Param('id') id: string,
    @Body() body: { studentId: string },
  ): Promise<{ status: string; data: any }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const enrollment = await this.service.enrollStudent(tenantId, id, body.studentId);

    return { status: 'success', data: enrollment };
  }

  @Post(':id/publish')
  @HttpCode(200)
  async publishCourse(
    @Param('id') id: string,
  ): Promise<{ status: string; data: any }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const course = await this.service.publishCourse(tenantId, id);

    return { status: 'success', data: course };
  }
}
