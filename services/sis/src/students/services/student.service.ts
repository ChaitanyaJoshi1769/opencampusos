import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { Student } from '@prisma/client';
import { StudentRepository } from '../repositories/student.repository';
import { EventService } from '../../events/services/event.service';
import { CreateStudentDto, UpdateStudentDto } from '../dtos/student.dto';

@Injectable()
export class StudentService {
  private readonly logger = new Logger(StudentService.name);

  constructor(
    private readonly studentRepository: StudentRepository,
    private readonly eventService: EventService,
  ) {}

  async createStudent(tenantId: string, dto: CreateStudentDto): Promise<Student> {
    this.logger.log(`Creating student: ${dto.email} for tenant: ${tenantId}`);

    // Validate unique student ID and email
    const existingByEmail = await this.studentRepository.findMany(tenantId, {
      email: dto.email,
    });

    if (existingByEmail.students.length > 0) {
      throw new ConflictException(`Student with email ${dto.email} already exists`);
    }

    if (dto.studentId) {
      const existingById = await this.studentRepository.findByStudentId(tenantId, dto.studentId);
      if (existingById) {
        throw new ConflictException(`Student ID ${dto.studentId} already in use`);
      }
    }

    // Create student
    const student = await this.studentRepository.create(tenantId, {
      studentId: dto.studentId || `STU-${Date.now()}`,
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
      phone: dto.phone,
      dateOfBirth: dto.dateOfBirth,
      programId: dto.programId,
      admissionDate: dto.admissionDate || new Date(),
      status: 'active',
      cumulativeCredits: 0,
    });

    // Publish domain event
    await this.eventService.publishEvent({
      id: student.id,
      type: 'student.created',
      aggregateId: student.id,
      aggregateType: 'Student',
      tenantId,
      timestamp: new Date(),
      version: 1,
      data: {
        studentId: student.id,
        firstName: student.firstName,
        lastName: student.lastName,
        email: student.email,
        programId: student.programId,
      },
      metadata: {
        requestId: 'system',
      },
    });

    this.logger.log(`✅ Student created: ${student.id}`);
    return student;
  }

  async getStudent(tenantId: string, studentId: string): Promise<Student> {
    const student = await this.studentRepository.findById(tenantId, studentId);

    if (!student) {
      throw new NotFoundException(`Student ${studentId} not found`);
    }

    return student;
  }

  async listStudents(
    tenantId: string,
    filters?: {
      status?: string;
      programId?: string;
      gpaMin?: number;
      limit?: number;
      offset?: number;
    },
  ): Promise<{ students: Student[]; total: number }> {
    const where: any = {};

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.programId) {
      where.programId = filters.programId;
    }

    if (filters?.gpaMin) {
      where.gpa = { gte: filters.gpaMin };
    }

    return this.studentRepository.findMany(
      tenantId,
      where,
      filters?.limit || 20,
      filters?.offset || 0,
    );
  }

  async updateStudent(tenantId: string, studentId: string, dto: UpdateStudentDto): Promise<Student> {
    // Verify student exists
    const existingStudent = await this.getStudent(tenantId, studentId);

    // Update student
    const updated = await this.studentRepository.update(tenantId, studentId, {
      firstName: dto.firstName ?? existingStudent.firstName,
      lastName: dto.lastName ?? existingStudent.lastName,
      phone: dto.phone ?? existingStudent.phone,
      status: dto.status ?? existingStudent.status,
      programId: dto.programId ?? existingStudent.programId,
    });

    // Publish event
    await this.eventService.publishEvent({
      id: studentId,
      type: 'student.updated',
      aggregateId: studentId,
      aggregateType: 'Student',
      tenantId,
      timestamp: new Date(),
      version: 1,
      data: {
        ...dto,
      },
      metadata: {
        requestId: 'system',
      },
    });

    this.logger.log(`✅ Student updated: ${studentId}`);
    return updated;
  }

  async deleteStudent(tenantId: string, studentId: string): Promise<{ success: boolean }> {
    // Verify student exists
    await this.getStudent(tenantId, studentId);

    // Soft delete
    await this.studentRepository.softDelete(tenantId, studentId);

    // Publish event
    await this.eventService.publishEvent({
      id: studentId,
      type: 'student.deleted',
      aggregateId: studentId,
      aggregateType: 'Student',
      tenantId,
      timestamp: new Date(),
      version: 1,
      data: { studentId },
      metadata: {
        requestId: 'system',
      },
    });

    this.logger.log(`✅ Student deleted: ${studentId}`);
    return { success: true };
  }

  async searchStudents(tenantId: string, query: string): Promise<Student[]> {
    if (!query || query.length < 2) {
      throw new BadRequestException('Search query must be at least 2 characters');
    }

    return this.studentRepository.searchByName(tenantId, query);
  }

  async getAtRiskStudents(tenantId: string): Promise<Student[]> {
    return this.studentRepository.findAtRisk(tenantId);
  }

  async updateGPA(tenantId: string, studentId: string, gpa: number): Promise<Student> {
    if (gpa < 0 || gpa > 4.0) {
      throw new BadRequestException('GPA must be between 0 and 4.0');
    }

    return this.studentRepository.updateGPA(tenantId, studentId, gpa);
  }

  async getStatistics(tenantId: string) {
    return this.studentRepository.getStatistics(tenantId);
  }
}
