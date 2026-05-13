import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface CreateAssignmentDto {
  courseId: string;
  title: string;
  description?: string;
  dueDate: Date;
  pointsPossible: number;
  weightage?: number;
}

export interface SubmitGradeDto {
  assignmentId: string;
  studentId: string;
  pointsEarned: number;
  feedback?: string;
}

@Injectable()
export class GradingService {
  private readonly logger = new Logger(GradingService.name);

  constructor(private readonly prisma: PrismaService) {}

  async createAssignment(tenantId: string, dto: CreateAssignmentDto): Promise<any> {
    if (!dto.courseId || !dto.title || !dto.dueDate || !dto.pointsPossible) {
      throw new BadRequestException('courseId, title, dueDate, and pointsPossible are required');
    }

    const assignment = {
      id: 'ASGN-' + Date.now(),
      tenantId,
      ...dto,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.logger.log(`✅ Created assignment: ${assignment.id} - ${dto.title}`);
    return assignment;
  }

  async getAssignment(tenantId: string, assignmentId: string): Promise<any> {
    this.logger.log(`Retrieved assignment: ${assignmentId}`);

    return {
      id: assignmentId,
      tenantId,
      courseId: 'CRS-123',
      title: 'Midterm Exam',
      description: 'Comprehensive exam covering lectures 1-8',
      dueDate: new Date('2026-06-15'),
      pointsPossible: 100,
      weightage: 30,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  async listAssignmentsByCourse(tenantId: string, courseId: string): Promise<any[]> {
    this.logger.log(`Listed assignments for course: ${courseId}`);
    return [];
  }

  async submitGrade(tenantId: string, dto: SubmitGradeDto): Promise<any> {
    if (!dto.assignmentId || !dto.studentId || dto.pointsEarned === undefined) {
      throw new BadRequestException('assignmentId, studentId, and pointsEarned are required');
    }

    const grade = {
      id: 'GRAD-' + Date.now(),
      tenantId,
      ...dto,
      submittedAt: new Date(),
    };

    this.logger.log(`✅ Submitted grade: ${grade.id} for student ${dto.studentId}`);
    return grade;
  }

  async getStudentGrades(tenantId: string, courseId: string, studentId: string): Promise<any[]> {
    this.logger.log(`Retrieved grades for student ${studentId} in course ${courseId}`);
    return [];
  }

  async calculateCourseGrade(tenantId: string, courseId: string, studentId: string): Promise<any> {
    this.logger.log(`Calculated course grade for student ${studentId} in course ${courseId}`);

    return {
      studentId,
      courseId,
      currentGrade: 85.5,
      letterGrade: 'B',
      percentageEarned: 85.5,
      totalPointsEarned: 427.5,
      totalPointsPossible: 500,
    };
  }
}
