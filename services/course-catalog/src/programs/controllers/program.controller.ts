import { Controller, Get, Post, Put, Body, Param, Query, Headers } from '@nestjs/common';
import { ProgramService } from '../services/program.service';

@Controller('programs')
export class ProgramController {
  constructor(private programService: ProgramService) {}

  @Post()
  async createProgram(@Body() data: any, @Headers('x-tenant-id') tenantId: string) {
    return this.programService.createProgram(tenantId, data);
  }

  @Get()
  async listPrograms(
    @Query() filters: any,
    @Headers('x-tenant-id') tenantId: string,
  ) {
    return this.programService.listPrograms(tenantId, filters);
  }

  @Get('search')
  async searchPrograms(
    @Query('q') query: string,
    @Headers('x-tenant-id') tenantId: string,
  ) {
    return this.programService.searchPrograms(tenantId, query);
  }

  @Get('stats')
  async getStats(@Headers('x-tenant-id') tenantId: string) {
    return this.programService.getProgramStats(tenantId);
  }

  @Get(':id')
  async getProgram(
    @Param('id') programId: string,
    @Headers('x-tenant-id') tenantId: string,
  ) {
    return this.programService.getProgram(tenantId, programId);
  }

  @Get(':id/courses')
  async getRequiredCourses(
    @Param('id') programId: string,
    @Headers('x-tenant-id') tenantId: string,
  ) {
    return this.programService.getRequiredCourses(tenantId, programId);
  }

  @Put(':id')
  async updateProgram(
    @Param('id') programId: string,
    @Body() data: any,
    @Headers('x-tenant-id') tenantId: string,
  ) {
    return this.programService.updateProgram(tenantId, programId, data);
  }

  @Post(':id/publish')
  async publishProgram(
    @Param('id') programId: string,
    @Headers('x-tenant-id') tenantId: string,
  ) {
    return this.programService.publishProgram(tenantId, programId);
  }

  @Post(':id/courses')
  async addRequiredCourse(
    @Param('id') programId: string,
    @Body() body: { courseId: string; sequenceNumber: number },
    @Headers('x-tenant-id') tenantId: string,
  ) {
    return this.programService.addRequiredCourse(tenantId, programId, body.courseId, body.sequenceNumber);
  }
}
