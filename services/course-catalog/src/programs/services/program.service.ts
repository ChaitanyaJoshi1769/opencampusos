import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ProgramService {
  constructor(private prisma: PrismaService) {}

  async createProgram(tenantId: string, data: any) {
    return this.prisma.program.create({
      data: { ...data, tenantId, status: 'draft' },
    });
  }

  async getProgram(tenantId: string, programId: string) {
    return this.prisma.program.findFirst({
      where: { id: programId, tenantId },
      include: { requiredCourses: true, department: true },
    });
  }

  async listPrograms(tenantId: string, filters?: any) {
    return this.prisma.program.findMany({
      where: {
        tenantId,
        ...(filters?.departmentId && { departmentId: filters.departmentId }),
        ...(filters?.degree && { degree: filters.degree }),
        ...(filters?.status && { status: filters.status }),
      },
      include: { department: true, _count: { select: { requiredCourses: true } } },
    });
  }

  async updateProgram(tenantId: string, programId: string, data: any) {
    return this.prisma.program.update({
      where: { id: programId },
      data,
    });
  }

  async publishProgram(tenantId: string, programId: string) {
    return this.prisma.program.update({
      where: { id: programId },
      data: { status: 'published', publishedAt: new Date() },
    });
  }

  async addRequiredCourse(tenantId: string, programId: string, courseId: string, sequence: number) {
    return this.prisma.programCourse.create({
      data: {
        programId,
        courseId,
        sequenceNumber: sequence,
      },
    });
  }

  async getRequiredCourses(tenantId: string, programId: string) {
    return this.prisma.programCourse.findMany({
      where: { programId },
      include: { course: true },
      orderBy: { sequenceNumber: 'asc' },
    });
  }

  async getProgramStats(tenantId: string) {
    const total = await this.prisma.program.count({ where: { tenantId } });
    const published = await this.prisma.program.count({
      where: { tenantId, status: 'published' },
    });
    const draft = await this.prisma.program.count({
      where: { tenantId, status: 'draft' },
    });
    return { total, published, draft };
  }

  async searchPrograms(tenantId: string, query: string) {
    return this.prisma.program.findMany({
      where: {
        tenantId,
        OR: [
          { code: { contains: query, mode: 'insensitive' } },
          { name: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
        ],
      },
      include: { department: true },
    });
  }
}
