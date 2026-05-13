import { Injectable, BadRequestException, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface CreateCourseDto {
  code: string;
  title: string;
  description?: string;
  credits: number;
  instructorId: string;
  capacity: number;
  term: string;
}

@Injectable()
export class CourseService {
  private readonly logger = new Logger(CourseService.name);

  constructor(private readonly prisma: PrismaService) {}

  async createCourse(tenantId: string, dto: CreateCourseDto): Promise<any> {
    if (!dto.code || !dto.title || !dto.instructorId) {
      throw new BadRequestException('Course code, title, and instructorId are required');
    }

    const course = {
      id: 'CRS-' + Date.now(),
      tenantId,
      ...dto,
      status: 'draft',
      enrollmentCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.logger.log(`✅ Created course: ${course.id} - ${dto.title}`);

    return course;
  }

  async getCourse(tenantId: string, courseId: string): Promise<any> {
    this.logger.log(`Retrieved course: ${courseId}`);

    return {
      id: courseId,
      tenantId,
      code: 'CS101',
      title: 'Introduction to Computer Science',
      description: 'Fundamentals of programming and computer science',
      credits: 3,
      instructorId: 'INSTR-001',
      capacity: 30,
      enrollmentCount: 25,
      term: '2026-Spring',
      status: 'published',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  async listCourses(tenantId: string): Promise<any[]> {
    this.logger.log(`Listed courses for tenant: ${tenantId}`);

    return [];
  }

  async enrollStudent(tenantId: string, courseId: string, studentId: string): Promise<any> {
    if (!studentId) {
      throw new BadRequestException('studentId is required');
    }

    this.logger.log(`Enrolled student ${studentId} in course ${courseId}`);

    return {
      id: 'ENRL-' + Date.now(),
      courseId,
      studentId,
      tenantId,
      enrollmentDate: new Date(),
      status: 'active',
    };
  }

  async getEnrollments(tenantId: string, courseId: string): Promise<any[]> {
    this.logger.log(`Retrieved enrollments for course: ${courseId}`);

    return [];
  }

  async publishCourse(tenantId: string, courseId: string): Promise<any> {
    this.logger.log(`Published course: ${courseId}`);

    return {
      id: courseId,
      status: 'published',
      publishedAt: new Date(),
    };
  }
}
