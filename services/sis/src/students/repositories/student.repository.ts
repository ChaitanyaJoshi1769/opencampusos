import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Student, Prisma } from '@prisma/client';

@Injectable()
export class StudentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(tenantId: string, data: Prisma.StudentCreateInput): Promise<Student> {
    return this.prisma.student.create({
      data: {
        ...data,
        tenantId,
      },
    });
  }

  async findById(tenantId: string, id: string): Promise<Student | null> {
    return this.prisma.student.findFirst({
      where: {
        id,
        tenantId,
        deletedAt: null,
      },
      include: {
        program: true,
      },
    });
  }

  async findByStudentId(tenantId: string, studentId: string): Promise<Student | null> {
    return this.prisma.student.findFirst({
      where: {
        studentId,
        tenantId,
        deletedAt: null,
      },
      include: {
        program: true,
      },
    });
  }

  async findMany(
    tenantId: string,
    where?: Prisma.StudentWhereInput,
    take?: number,
    skip?: number,
  ): Promise<{ students: Student[]; total: number }> {
    const [students, total] = await Promise.all([
      this.prisma.student.findMany({
        where: {
          ...where,
          tenantId,
          deletedAt: null,
        },
        include: {
          program: true,
        },
        take,
        skip,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.student.count({
        where: {
          ...where,
          tenantId,
          deletedAt: null,
        },
      }),
    ]);

    return { students, total };
  }

  async findByProgramId(tenantId: string, programId: string): Promise<Student[]> {
    return this.prisma.student.findMany({
      where: {
        programId,
        tenantId,
        deletedAt: null,
      },
      include: {
        program: true,
      },
    });
  }

  async findByStatus(tenantId: string, status: string): Promise<Student[]> {
    return this.prisma.student.findMany({
      where: {
        status,
        tenantId,
        deletedAt: null,
      },
      include: {
        program: true,
      },
    });
  }

  async findByClassYear(tenantId: string, classYear: string): Promise<Student[]> {
    return this.prisma.student.findMany({
      where: {
        classYear,
        tenantId,
        deletedAt: null,
      },
      include: {
        program: true,
      },
    });
  }

  async update(tenantId: string, id: string, data: Prisma.StudentUpdateInput): Promise<Student> {
    return this.prisma.student.update({
      where: { id },
      data: {
        ...data,
        tenantId,
        updatedAt: new Date(),
      },
      include: {
        program: true,
      },
    });
  }

  async updateGPA(tenantId: string, id: string, gpa: number): Promise<Student> {
    return this.prisma.student.update({
      where: { id },
      data: { gpa, updatedAt: new Date() },
      include: {
        program: true,
      },
    });
  }

  async updateStatus(tenantId: string, id: string, status: string): Promise<Student> {
    return this.prisma.student.update({
      where: { id },
      data: { status, updatedAt: new Date() },
      include: {
        program: true,
      },
    });
  }

  async softDelete(tenantId: string, id: string): Promise<Student> {
    return this.prisma.student.update({
      where: { id },
      data: { deletedAt: new Date(), updatedAt: new Date() },
      include: {
        program: true,
      },
    });
  }

  async hardDelete(tenantId: string, id: string): Promise<boolean> {
    await this.prisma.student.delete({
      where: { id },
    });
    return true;
  }

  async searchByName(tenantId: string, query: string): Promise<Student[]> {
    return this.prisma.student.findMany({
      where: {
        tenantId,
        deletedAt: null,
        OR: [
          { firstName: { contains: query, mode: 'insensitive' } },
          { lastName: { contains: query, mode: 'insensitive' } },
          { email: { contains: query, mode: 'insensitive' } },
        ],
      },
      include: {
        program: true,
      },
      take: 20,
    });
  }

  async findAtRisk(tenantId: string): Promise<Student[]> {
    return this.prisma.student.findMany({
      where: {
        tenantId,
        deletedAt: null,
        AND: [
          {
            OR: [
              { status: 'suspended' },
              { gpa: { lt: 2.0 } },
            ],
          },
        ],
      },
      include: {
        program: true,
      },
    });
  }

  async getStatistics(tenantId: string) {
    const [totalStudents, activeStudents, graduatedStudents, withdrawnStudents] = await Promise.all([
      this.prisma.student.count({
        where: { tenantId, deletedAt: null },
      }),
      this.prisma.student.count({
        where: { tenantId, status: 'active', deletedAt: null },
      }),
      this.prisma.student.count({
        where: { tenantId, status: 'graduated', deletedAt: null },
      }),
      this.prisma.student.count({
        where: { tenantId, status: 'withdrawn', deletedAt: null },
      }),
    ]);

    const avgGPA = await this.prisma.student.aggregate({
      where: { tenantId, deletedAt: null },
      _avg: { gpa: true },
    });

    return {
      totalStudents,
      activeStudents,
      graduatedStudents,
      withdrawnStudents,
      averageGPA: avgGPA._avg.gpa || 0,
    };
  }
}
