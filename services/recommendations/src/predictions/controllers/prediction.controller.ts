import {
  Controller,
  Get,
  Post,
  Param,
  Headers,
  Query,
} from '@nestjs/common';
import { PredictionService } from '../services/prediction.service';

@Controller('predictions')
export class PredictionController {
  constructor(private predictionService: PredictionService) {}

  @Post('students/:studentId/success')
  async predictSuccess(
    @Headers('x-tenant-id') tenantId: string,
    @Param('studentId') studentId: string,
  ) {
    return this.predictionService.predictStudentSuccess(tenantId, studentId);
  }

  @Post('students/:studentId/courses/:courseId')
  async predictCourseSuccess(
    @Headers('x-tenant-id') tenantId: string,
    @Param('studentId') studentId: string,
    @Param('courseId') courseId: string,
  ) {
    return this.predictionService.predictCourseSuccess(tenantId, studentId, courseId);
  }

  @Get('students/:studentId/history')
  async getPredictionHistory(
    @Headers('x-tenant-id') tenantId: string,
    @Param('studentId') studentId: string,
  ) {
    return this.predictionService.getPredictionHistory(tenantId, studentId);
  }

  @Get('risk-assessment')
  async getRiskAssessment(
    @Headers('x-tenant-id') tenantId: string,
  ) {
    return this.predictionService.getRiskAssessment(tenantId);
  }

  @Get('students/:studentId/interventions')
  async getInterventions(
    @Headers('x-tenant-id') tenantId: string,
    @Param('studentId') studentId: string,
  ) {
    return this.predictionService.getInterventionRecommendations(tenantId, studentId);
  }
}
