import { Controller, Get, Post, Put, Body, Param, Query, Headers } from '@nestjs/common';
import { CourseService } from '../services/course.service';

@Controller('courses')
export class CourseController {
  constructor(private courseService: CourseService) {}

  @Post()
  async createCourse(@Body() data: any, @Headers('x-tenant-id') tenantId: string) {
    return this.courseService.createCourse(tenantId, data);
  }

  @Get()
  async listCourses(
    @Query() filters: any,
    @Headers('x-tenant-id') tenantId: string,
  ) {
    return this.courseService.listCourses(tenantId, filters);
  }

  @Get('search')
  async searchCourses(
    @Query('q') query: string,
    @Headers('x-tenant-id') tenantId: string,
  ) {
    return this.courseService.searchCourses(tenantId, query);
  }

  @Get('stats')
  async getStats(@Headers('x-tenant-id') tenantId: string) {
    return this.courseService.getCourseStats(tenantId);
  }

  @Get(':id')
  async getCourse(
    @Param('id') courseId: string,
    @Headers('x-tenant-id') tenantId: string,
  ) {
    return this.courseService.getCourse(tenantId, courseId);
  }

  @Put(':id')
  async updateCourse(
    @Param('id') courseId: string,
    @Body() data: any,
    @Headers('x-tenant-id') tenantId: string,
  ) {
    return this.courseService.updateCourse(tenantId, courseId, data);
  }

  @Post(':id/publish')
  async publishCourse(
    @Param('id') courseId: string,
    @Headers('x-tenant-id') tenantId: string,
  ) {
    return this.courseService.publishCourse(tenantId, courseId);
  }

  @Post(':id/deprecate')
  async deprecateCourse(
    @Param('id') courseId: string,
    @Headers('x-tenant-id') tenantId: string,
  ) {
    return this.courseService.deprecateCourse(tenantId, courseId);
  }

  @Get('department/:deptId')
  async getCoursesByDepartment(
    @Param('deptId') departmentId: string,
    @Headers('x-tenant-id') tenantId: string,
  ) {
    return this.courseService.getCoursesbyDepartment(tenantId, departmentId);
  }
}
