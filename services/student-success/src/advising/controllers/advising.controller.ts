import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Headers,
} from '@nestjs/common';
import { AdvisingService } from '../services/advising.service';

@Controller('advising')
export class AdvisingController {
  constructor(private advisingService: AdvisingService) {}

  @Post('plans')
  async createPlan(
    @Headers('x-tenant-id') tenantId: string,
    @Body() body: any,
  ) {
    return this.advisingService.createAdvisingPlan(tenantId, body.studentId, body);
  }

  @Get('plans/:planId')
  async getPlan(
    @Headers('x-tenant-id') tenantId: string,
    @Param('planId') planId: string,
  ) {
    return this.advisingService.getAdvisingPlan(tenantId, planId);
  }

  @Get('students/:studentId/plans')
  async listPlans(
    @Headers('x-tenant-id') tenantId: string,
    @Param('studentId') studentId: string,
  ) {
    return this.advisingService.listStudentPlans(tenantId, studentId);
  }

  @Patch('plans/:planId/approve')
  async approvePlan(
    @Headers('x-tenant-id') tenantId: string,
    @Headers('x-user-id') advisorId: string,
    @Param('planId') planId: string,
  ) {
    return this.advisingService.approvePlan(tenantId, planId, advisorId);
  }

  @Get('students/:studentId/progress')
  async trackProgress(
    @Headers('x-tenant-id') tenantId: string,
    @Param('studentId') studentId: string,
  ) {
    return this.advisingService.trackProgress(tenantId, studentId);
  }

  @Get('students/:studentId/degree-audit')
  async getDegreeAudit(
    @Headers('x-tenant-id') tenantId: string,
    @Param('studentId') studentId: string,
  ) {
    return this.advisingService.getDegreeAudit(tenantId, studentId);
  }
}
