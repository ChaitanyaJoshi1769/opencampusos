import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PredictionService {
  private logger = new Logger(PredictionService.name);

  constructor(private prisma: PrismaService) {}

  async predictStudentSuccess(tenantId: string, studentId: string) {
    this.logger.log(`Predicting success for student ${studentId}`);

    const prediction = await this.prisma.prediction.create({
      data: {
        tenantId,
        studentId,
        predictionType: 'success',
        requestedAt: new Date(),
      },
    });

    const successScore = Math.random() * 100;
    const riskLevel = this.getRiskLevel(successScore);

    const result = {
      studentId,
      successScore: parseFloat(successScore.toFixed(2)),
      riskLevel,
      factors: this.generateRiskFactors(riskLevel),
      recommendations: this.generateRecommendations(riskLevel),
    };

    await this.prisma.prediction.update({
      where: { id: prediction.id },
      data: {
        result,
        generatedAt: new Date(),
      },
    });

    return result;
  }

  async predictCourseSuccess(tenantId: string, studentId: string, courseId: string) {
    this.logger.log(`Predicting course success for student ${studentId} in ${courseId}`);

    const successScore = Math.random() * 100;

    return {
      studentId,
      courseId,
      predictedGrade: this.getPredictedGrade(successScore),
      successProbability: parseFloat((successScore / 100).toFixed(2)),
      riskLevel: this.getRiskLevel(successScore),
    };
  }

  async getPredictionHistory(tenantId: string, studentId: string) {
    return this.prisma.prediction.findMany({
      where: {
        tenantId,
        studentId,
      },
      orderBy: { generatedAt: 'desc' },
    });
  }

  async getRiskAssessment(tenantId: string) {
    const predictions = await this.prisma.prediction.findMany({
      where: { tenantId },
    });

    const atRisk = predictions.filter((p) => {
      const result = p.result as any;
      return result?.riskLevel === 'high';
    }).length;

    return {
      totalStudents: predictions.length,
      atRisk,
      riskPercentage: predictions.length > 0 ? ((atRisk / predictions.length) * 100).toFixed(2) : 0,
    };
  }

  async getInterventionRecommendations(tenantId: string, studentId: string) {
    const prediction = await this.predictStudentSuccess(tenantId, studentId);

    if (prediction.riskLevel !== 'high') {
      return { recommendations: [], message: 'Student is on track' };
    }

    return {
      recommendations: [
        {
          action: 'Schedule tutoring session',
          priority: 'high',
          deadline: '48 hours',
        },
        {
          action: 'Connect with academic advisor',
          priority: 'high',
          deadline: 'ASAP',
        },
        {
          action: 'Enroll in study skills workshop',
          priority: 'medium',
          deadline: '1 week',
        },
      ],
    };
  }

  private getRiskLevel(score: number): 'low' | 'medium' | 'high' {
    if (score >= 75) return 'low';
    if (score >= 50) return 'medium';
    return 'high';
  }

  private getPredictedGrade(score: number): string {
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  }

  private generateRiskFactors(riskLevel: string) {
    const factors: { [key: string]: string[] } = {
      low: ['Good attendance', 'Strong engagement', 'High GPA'],
      medium: ['Inconsistent participation', 'Missed deadlines', 'Below average GPA'],
      high: ['Poor attendance', 'Low engagement', 'Failing grades', 'Multiple withdrawals'],
    };

    return factors[riskLevel] || [];
  }

  private generateRecommendations(riskLevel: string) {
    const recs: { [key: string]: string[] } = {
      low: ['Continue current pace', 'Explore advanced courses'],
      medium: ['Increase study time', 'Seek tutoring support', 'Meet with advisor'],
      high: ['Urgent intervention needed', 'Consider course drop', 'Financial aid review'],
    };

    return recs[riskLevel] || [];
  }
}
