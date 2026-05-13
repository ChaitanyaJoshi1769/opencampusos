import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CourseService {
  constructor(private prisma: PrismaService) {}

  async createCourse(tenantId: string, data: any) {
    return this.prisma.course.create({
      data: {
        ...data,
        tenantId,
        status: 'draft',
      },
    });
  }

  async getCourse(tenantId: string, courseId: string) {
    return this.prisma.course.findFirst({
      where: { id: courseId, tenantId },
      include: { prerequisites: true, department: true },
    });
  }

  async listCourses(tenantId: string, filters?: any) {
    return this.prisma.course.findMany({
      where: {
        tenantId,
        ...(filters?.departmentId && { departmentId: filters.departmentId }),
        ...(filters?.level && { level: filters.level }),
        ...(filters?.status && { status: filters.status }),
      },
      include: { prerequisites: true, department: true },
      skip: filters?.skip || 0,
      take: filters?.take || 20,
    });
  }

  async updateCourse(tenantId: string, courseId: string, data: any) {
    return this.prisma.course.update({
      where: { id: courseId },
      data,
    });
  }

  async publishCourse(tenantId: string, courseId: string) {
    return this.prisma.course.update({
      where: { id: courseId },
      data: { status: 'published', publishedAt: new Date() },
    });
  }

  async deprecateCourse(tenantId: string, courseId: string) {
    return this.prisma.course.update({
      where: { id: courseId },
      data: { status: 'deprecated', deprecatedAt: new Date() },
    });
  }

  async searchCourses(tenantId: string, query: string) {
    return this.prisma.course.findMany({
      where: {
        tenantId,
        OR: [
          { code: { contains: query, mode: 'insensitive' } },
          { title: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
        ],
      },
      take: 10,
    });
  }

  async getCoursesbyDepartment(tenantId: string, departmentId: string) {
    return this.prisma.course.findMany({
      where: { tenantId, departmentId },
      include: { prerequisites: true },
    });
  }

  async getCoursesByLevel(tenantId: string, level: string) {
    return this.prisma.course.findMany({
      where: { tenantId, level },
    });
  }

  async getCourseStats(tenantId: string) {
    const total = await this.prisma.course.count({ where: { tenantId } });
    const published = await this.prisma.course.count({
      where: { tenantId, status: 'published' },
    });
    const draft = await this.prisma.course.count({
      where: { tenantId, status: 'draft' },
    });
    const deprecated = await this.prisma.course.count({
      where: { tenantId, status: 'deprecated' },
    });
    return { total, published, draft, deprecated };
  }
}
