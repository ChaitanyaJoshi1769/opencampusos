import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Headers,
} from '@nestjs/common';
import { InterventionService } from '../services/intervention.service';

@Controller('interventions')
export class InterventionController {
  constructor(private interventionService: InterventionService) {}

  @Get('students/:studentId/recommendations')
  async getRecommendations(
    @Headers('x-tenant-id') tenantId: string,
    @Param('studentId') studentId: string,
  ) {
    return this.interventionService.recommendInterventions(tenantId, studentId);
  }

  @Post()
  async track(
    @Headers('x-tenant-id') tenantId: string,
    @Body() body: any,
  ) {
    return this.interventionService.trackIntervention(tenantId, body.studentId, body);
  }

  @Get('students/:studentId')
  async getInterventions(
    @Headers('x-tenant-id') tenantId: string,
    @Param('studentId') studentId: string,
  ) {
    return this.interventionService.getStudentInterventions(tenantId, studentId);
  }

  @Patch(':interventionId/complete')
  async complete(
    @Headers('x-tenant-id') tenantId: string,
    @Param('interventionId') interventionId: string,
    @Body() body: { outcome: string },
  ) {
    return this.interventionService.completeIntervention(tenantId, interventionId, body.outcome);
  }

  @Get('stats')
  async getStats(
    @Headers('x-tenant-id') tenantId: string,
  ) {
    return this.interventionService.getInterventionStats(tenantId);
  }
}
