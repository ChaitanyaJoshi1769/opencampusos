import { Controller, Get, Post, Delete, Body, Param, Query, Headers } from '@nestjs/common';
import { PrerequisiteService } from '../services/prerequisite.service';

@Controller('prerequisites')
export class PrerequisiteController {
  constructor(private prereqService: PrerequisiteService) {}

  @Post()
  async addPrerequisite(
    @Body() body: { courseId: string; prerequisiteCourseId: string; minimumGrade?: string },
    @Headers('x-tenant-id') tenantId: string,
  ) {
    return this.prereqService.addPrerequisite(tenantId, body.courseId, body.prerequisiteCourseId, body.minimumGrade);
  }

  @Get(':courseId')
  async getPrerequisites(
    @Param('courseId') courseId: string,
    @Headers('x-tenant-id') tenantId: string,
  ) {
    return this.prereqService.getPrerequisites(tenantId, courseId);
  }

  @Get(':courseId/chain')
  async getPrerequisiteChain(
    @Param('courseId') courseId: string,
    @Headers('x-tenant-id') tenantId: string,
  ) {
    return this.prereqService.getPrerequisiteChain(tenantId, courseId);
  }

  @Get(':courseId/required-for')
  async getCoursesRequiredFor(
    @Param('courseId') courseId: string,
    @Headers('x-tenant-id') tenantId: string,
  ) {
    return this.prereqService.getCoursesRequiredFor(tenantId, courseId);
  }

  @Post('validate')
  async validatePrerequisites(
    @Body() body: { studentCourses: string[]; targetCourseId: string },
    @Headers('x-tenant-id') tenantId: string,
  ) {
    return this.prereqService.validatePrerequisites(tenantId, body.studentCourses, body.targetCourseId);
  }

  @Delete(':courseId/:prereqCourseId')
  async removePrerequisite(
    @Param('courseId') courseId: string,
    @Param('prereqCourseId') prereqCourseId: string,
    @Headers('x-tenant-id') tenantId: string,
  ) {
    return this.prereqService.removePrerequisite(tenantId, courseId, prereqCourseId);
  }
}
