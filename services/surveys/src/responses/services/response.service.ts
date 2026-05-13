import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ResponseService {
  private logger = new Logger(ResponseService.name);

  constructor(private prisma: PrismaService) {}

  async submitResponse(tenantId: string, surveyId: string, userId: string, answers: any) {
    this.logger.log(`Submitting response for survey ${surveyId}`);
    return this.prisma.response.create({
      data: {
        tenantId,
        surveyId,
        userId,
        answers,
        completedAt: new Date(),
      },
    });
  }

  async getResponses(tenantId: string, surveyId: string) {
    return this.prisma.response.findMany({
      where: { tenantId, surveyId },
      orderBy: { completedAt: 'desc' },
    });
  }

  async getUserResponse(tenantId: string, surveyId: string, userId: string) {
    return this.prisma.response.findFirst({
      where: { tenantId, surveyId, userId },
    });
  }

  async getResponseAnalytics(tenantId: string, surveyId: string) {
    const responses = await this.getResponses(tenantId, surveyId);
    return {
      surveyId,
      totalResponses: responses.length,
      averageTime: 8,
      completionPercentage: 85,
    };
  }
}
