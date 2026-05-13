import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Headers,
  Query,
} from '@nestjs/common';
import { SurveyService } from '../services/survey.service';

@Controller('surveys')
export class SurveyController {
  constructor(private surveyService: SurveyService) {}

  @Post()
  async create(
    @Headers('x-tenant-id') tenantId: string,
    @Body() body: any,
  ) {
    return this.surveyService.createSurvey(tenantId, body);
  }

  @Get(':surveyId')
  async get(
    @Headers('x-tenant-id') tenantId: string,
    @Param('surveyId') surveyId: string,
  ) {
    return this.surveyService.getSurvey(tenantId, surveyId);
  }

  @Get()
  async list(
    @Headers('x-tenant-id') tenantId: string,
    @Query('type') type?: string,
  ) {
    return this.surveyService.listSurveys(tenantId, type);
  }

  @Patch(':surveyId/publish')
  async publish(
    @Headers('x-tenant-id') tenantId: string,
    @Param('surveyId') surveyId: string,
  ) {
    return this.surveyService.publishSurvey(tenantId, surveyId);
  }

  @Patch(':surveyId/close')
  async close(
    @Headers('x-tenant-id') tenantId: string,
    @Param('surveyId') surveyId: string,
  ) {
    return this.surveyService.closeSurvey(tenantId, surveyId);
  }

  @Post(':surveyId/questions')
  async addQuestion(
    @Headers('x-tenant-id') tenantId: string,
    @Param('surveyId') surveyId: string,
    @Body() body: any,
  ) {
    return this.surveyService.addQuestion(tenantId, surveyId, body);
  }

  @Get(':surveyId/stats')
  async getStats(
    @Headers('x-tenant-id') tenantId: string,
    @Param('surveyId') surveyId: string,
  ) {
    return this.surveyService.getSurveyStats(tenantId, surveyId);
  }
}
