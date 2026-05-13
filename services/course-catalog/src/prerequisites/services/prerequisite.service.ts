import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PrerequisiteService {
  constructor(private prisma: PrismaService) {}

  async addPrerequisite(tenantId: string, courseId: string, prereqCourseId: string, minGrade: string = 'C') {
    return this.prisma.prerequisite.create({
      data: {
        courseId,
        prerequisiteCourseId: prereqCourseId,
        minimumGrade: minGrade,
      },
    });
  }

  async getPrerequisites(tenantId: string, courseId: string) {
    return this.prisma.prerequisite.findMany({
      where: { courseId },
      include: { prerequisiteCourse: true },
    });
  }

  async getCoursesRequiredFor(tenantId: string, courseId: string) {
    return this.prisma.prerequisite.findMany({
      where: { prerequisiteCourseId: courseId },
      include: { course: true },
    });
  }

  async removePrerequisite(tenantId: string, courseId: string, prereqCourseId: string) {
    return this.prisma.prerequisite.delete({
      where: {
        courseId_prerequisiteCourseId: {
          courseId,
          prerequisiteCourseId: prereqCourseId,
        },
      },
    });
  }

  async validatePrerequisites(tenantId: string, studentCourses: string[], targetCourseId: string) {
    const prerequisites = await this.getPrerequisites(tenantId, targetCourseId);
    const completed = prerequisites.every(pre => studentCourses.includes(pre.prerequisiteCourseId));
    return { canEnroll: completed, prerequisites };
  }

  async getPrerequisiteChain(tenantId: string, courseId: string, depth = 0, visited = new Set()) {
    if (depth > 5 || visited.has(courseId)) return [];
    visited.add(courseId);

    const prerequisites = await this.getPrerequisites(tenantId, courseId);
    const chain = [];

    for (const prereq of prerequisites) {
      chain.push({
        courseId: prereq.prerequisiteCourseId,
        minimumGrade: prereq.minimumGrade,
      });
      const subChain = await this.getPrerequisiteChain(tenantId, prereq.prerequisiteCourseId, depth + 1, visited);
      chain.push(...subChain);
    }

    return chain;
  }
}
