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
import { AlertService } from '../services/alert.service';

@Controller('alerts')
export class AlertController {
  constructor(private alertService: AlertService) {}

  @Post()
  async create(
    @Headers('x-tenant-id') tenantId: string,
    @Body() body: any,
  ) {
    return this.alertService.createAlert(tenantId, body.studentId, body);
  }

  @Get('students/:studentId')
  async getAlerts(
    @Headers('x-tenant-id') tenantId: string,
    @Param('studentId') studentId: string,
    @Query('status') status?: string,
  ) {
    return this.alertService.getStudentAlerts(tenantId, studentId, status);
  }

  @Patch(':alertId/dismiss')
  async dismiss(
    @Headers('x-tenant-id') tenantId: string,
    @Param('alertId') alertId: string,
  ) {
    return this.alertService.dismissAlert(tenantId, alertId);
  }

  @Get('summary')
  async getSummary(
    @Headers('x-tenant-id') tenantId: string,
  ) {
    return this.alertService.getAlertSummary(tenantId);
  }

  @Post('students/:studentId/early-warning')
  async triggerWarning(
    @Headers('x-tenant-id') tenantId: string,
    @Param('studentId') studentId: string,
  ) {
    return this.alertService.triggerEarlyWarning(tenantId, studentId);
  }
}
