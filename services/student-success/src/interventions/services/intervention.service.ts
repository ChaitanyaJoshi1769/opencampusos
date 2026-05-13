import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class InterventionService {
  private logger = new Logger(InterventionService.name);

  constructor(private prisma: PrismaService) {}

  async recommendInterventions(tenantId: string, studentId: string) {
    this.logger.log(`Recommending interventions for student ${studentId}`);

    return {
      studentId,
      recommendations: [
        {
          type: 'tutoring',
          subject: 'Mathematics',
          priority: 'high',
          contact: 'tutoring@example.com',
        },
        {
          type: 'academic_advising',
          topic: 'Course selection',
          priority: 'high',
          contact: 'advisor@example.com',
        },
        {
          type: 'counseling',
          service: 'Mental health support',
          priority: 'medium',
          contact: 'counseling@example.com',
        },
      ],
    };
  }

  async trackIntervention(tenantId: string, studentId: string, data: any) {
    return this.prisma.intervention.create({
      data: {
        tenantId,
        studentId,
        ...data,
        status: 'active',
        startedAt: new Date(),
      },
    });
  }

  async getStudentInterventions(tenantId: string, studentId: string) {
    return this.prisma.intervention.findMany({
      where: { tenantId, studentId },
      orderBy: { startedAt: 'desc' },
    });
  }

  async completeIntervention(tenantId: string, interventionId: string, outcome: string) {
    return this.prisma.intervention.update({
      where: { id: interventionId },
      data: {
        status: 'completed',
        completedAt: new Date(),
        outcome,
      },
    });
  }

  async getInterventionStats(tenantId: string) {
    const interventions = await this.prisma.intervention.findMany({
      where: { tenantId },
    });

    const completed = interventions.filter((i) => i.status === 'completed').length;
    const active = interventions.filter((i) => i.status === 'active').length;

    return {
      totalInterventions: interventions.length,
      active,
      completed,
      successRate: interventions.length > 0 ? (completed / interventions.length) * 100 : 0,
    };
  }
}
