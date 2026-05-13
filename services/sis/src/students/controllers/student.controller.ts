import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  UseFilters,
} from '@nestjs/common';
import { StudentService } from '../services/student.service';
import {
  CreateStudentDto,
  UpdateStudentDto,
  StudentListQueryDto,
  UpdateGPADto,
} from '../dtos/student.dto';
import { Student } from '@prisma/client';

@Controller('v1/students')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Post()
  @HttpCode(201)
  async create(
    @Body() dto: CreateStudentDto,
  ): Promise<{ status: string; data: Student }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const student = await this.studentService.createStudent(tenantId, dto);

    return {
      status: 'success',
      data: student,
    };
  }

  @Get()
  async list(
    @Query() query: StudentListQueryDto,
  ): Promise<{ status: string; data: { students: Student[]; total: number } }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const result = await this.studentService.listStudents(tenantId, {
      status: query.status,
      programId: query.programId,
      gpaMin: query.gpaMin,
      limit: query.limit,
      offset: query.offset,
    });

    return {
      status: 'success',
      data: result,
    };
  }

  @Get('search')
  async search(
    @Query('q') query: string,
  ): Promise<{ status: string; data: Student[] }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const students = await this.studentService.searchStudents(tenantId, query);

    return {
      status: 'success',
      data: students,
    };
  }

  @Get('at-risk')
  async atRisk(): Promise<{ status: string; data: Student[] }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const students = await this.studentService.getAtRiskStudents(tenantId);

    return {
      status: 'success',
      data: students,
    };
  }

  @Get('statistics')
  async statistics(): Promise<{
    status: string;
    data: {
      totalStudents: number;
      activeStudents: number;
      graduatedStudents: number;
      withdrawnStudents: number;
      averageGPA: number;
    };
  }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const stats = await this.studentService.getStatistics(tenantId);

    return {
      status: 'success',
      data: stats,
    };
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
  ): Promise<{ status: string; data: Student }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const student = await this.studentService.getStudent(tenantId, id);

    return {
      status: 'success',
      data: student,
    };
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateStudentDto,
  ): Promise<{ status: string; data: Student }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const student = await this.studentService.updateStudent(tenantId, id, dto);

    return {
      status: 'success',
      data: student,
    };
  }

  @Patch(':id/gpa')
  async updateGPA(
    @Param('id') id: string,
    @Body() dto: UpdateGPADto,
  ): Promise<{ status: string; data: Student }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const student = await this.studentService.updateGPA(tenantId, id, dto.gpa);

    return {
      status: 'success',
      data: student,
    };
  }

  @Delete(':id')
  @HttpCode(200)
  async delete(
    @Param('id') id: string,
  ): Promise<{ status: string; data: { success: boolean } }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const result = await this.studentService.deleteStudent(tenantId, id);

    return {
      status: 'success',
      data: result,
    };
  }
}
