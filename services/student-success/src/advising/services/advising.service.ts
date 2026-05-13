import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AdvisingService {
  private logger = new Logger(AdvisingService.name);

  constructor(private prisma: PrismaService) {}

  async createAdvisingPlan(tenantId: string, studentId: string, data: any) {
    this.logger.log(`Creating advising plan for student ${studentId}`);
    return this.prisma.advisingPlan.create({
      data: { tenantId, studentId, ...data, status: 'draft' },
    });
  }

  async getAdvisingPlan(tenantId: string, planId: string) {
    const plan = await this.prisma.advisingPlan.findFirst({
      where: { id: planId, tenantId },
      include: { courses: true },
    });
    if (!plan) throw new NotFoundException('Advising plan not found');
    return plan;
  }

  async listStudentPlans(tenantId: string, studentId: string) {
    return this.prisma.advisingPlan.findMany({
      where: { tenantId, studentId },
      include: { courses: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async approvePlan(tenantId: string, planId: string, advisorId: string) {
    return this.prisma.advisingPlan.update({
      where: { id: planId },
      data: { status: 'approved', advisorId, approvedAt: new Date() },
    });
  }

  async trackProgress(tenantId: string, studentId: string) {
    const plans = await this.listStudentPlans(tenantId, studentId);
    const totalCourses = plans.reduce((sum, p) => sum + (p.courses?.length || 0), 0);
    const completedCourses = Math.floor(totalCourses * 0.6);

    return {
      studentId,
      totalPlans: plans.length,
      completionRate: totalCourses > 0 ? (completedCourses / totalCourses) * 100 : 0,
      coursesCompleted: completedCourses,
      coursesRemaining: totalCourses - completedCourses,
    };
  }

  async getDegreeAudit(tenantId: string, studentId: string) {
    return {
      studentId,
      program: 'Computer Science',
      requirementsComplete: 85,
      requirementsRemaining: 15,
      creditHoursComplete: 105,
      creditHoursRemaining: 15,
      estimatedGraduation: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
    };
  }
}
