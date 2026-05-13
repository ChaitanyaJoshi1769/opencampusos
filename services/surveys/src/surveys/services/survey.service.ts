import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class SurveyService {
  private logger = new Logger(SurveyService.name);

  constructor(private prisma: PrismaService) {}

  async createSurvey(tenantId: string, data: any) {
    this.logger.log(`Creating survey: ${data.title}`);
    return this.prisma.survey.create({
      data: { tenantId, ...data, status: 'draft' },
    });
  }

  async getSurvey(tenantId: string, surveyId: string) {
    const survey = await this.prisma.survey.findFirst({
      where: { id: surveyId, tenantId },
      include: { questions: true },
    });
    if (!survey) throw new NotFoundException('Survey not found');
    return survey;
  }

  async listSurveys(tenantId: string, type?: string) {
    const where: any = { tenantId };
    if (type) where.type = type;
    return this.prisma.survey.findMany({
      where,
      include: { questions: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async publishSurvey(tenantId: string, surveyId: string) {
    return this.prisma.survey.update({
      where: { id: surveyId },
      data: { status: 'active', publishedAt: new Date() },
    });
  }

  async closeSurvey(tenantId: string, surveyId: string) {
    return this.prisma.survey.update({
      where: { id: surveyId },
      data: { status: 'closed', closedAt: new Date() },
    });
  }

  async addQuestion(tenantId: string, surveyId: string, question: any) {
    return this.prisma.question.create({
      data: { surveyId, ...question, tenantId },
    });
  }

  async getSurveyStats(tenantId: string, surveyId: string) {
    const responses = await this.prisma.response.findMany({
      where: { tenantId, surveyId },
    });

    return {
      surveyId,
      totalResponses: responses.length,
      responseRate: (responses.length / 100) * 100,
      completionRate: 75,
    };
  }
}
