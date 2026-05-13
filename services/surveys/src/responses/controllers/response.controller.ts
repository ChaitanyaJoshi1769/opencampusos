import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Headers,
  Query,
} from '@nestjs/common';
import { ResponseService } from '../services/response.service';

@Controller('responses')
export class ResponseController {
  constructor(private responseService: ResponseService) {}

  @Post('surveys/:surveyId/submit')
  async submit(
    @Headers('x-tenant-id') tenantId: string,
    @Headers('x-user-id') userId: string,
    @Param('surveyId') surveyId: string,
    @Body() body: { answers: any },
  ) {
    return this.responseService.submitResponse(tenantId, surveyId, userId, body.answers);
  }

  @Get('surveys/:surveyId')
  async getResponses(
    @Headers('x-tenant-id') tenantId: string,
    @Param('surveyId') surveyId: string,
  ) {
    return this.responseService.getResponses(tenantId, surveyId);
  }

  @Get('surveys/:surveyId/user')
  async getUserResponse(
    @Headers('x-tenant-id') tenantId: string,
    @Headers('x-user-id') userId: string,
    @Param('surveyId') surveyId: string,
  ) {
    return this.responseService.getUserResponse(tenantId, surveyId, userId);
  }

  @Get('surveys/:surveyId/analytics')
  async getAnalytics(
    @Headers('x-tenant-id') tenantId: string,
    @Param('surveyId') surveyId: string,
  ) {
    return this.responseService.getResponseAnalytics(tenantId, surveyId);
  }
}
