import { Controller, Get, Post, Put, Delete, Body, Param, Headers } from '@nestjs/common';
import { BenefitService } from '../services/benefit.service';

@Controller('benefits')
export class BenefitController {
  constructor(private benefitService: BenefitService) {}

  @Post()
  async enrollBenefit(
    @Body() body: { employeeId: string; benefitType: string; [key: string]: any },
    @Headers('x-tenant-id') tenantId: string,
  ) {
    const { employeeId, benefitType, ...data } = body;
    return this.benefitService.enrollBenefit(tenantId, employeeId, benefitType, data);
  }

  @Get('summary')
  async getSummary(@Headers('x-tenant-id') tenantId: string) {
    return this.benefitService.getBenefitSummary(tenantId);
  }

  @Get('employee/:employeeId')
  async getEmployeeBenefits(
    @Param('employeeId') employeeId: string,
    @Headers('x-tenant-id') tenantId: string,
  ) {
    return this.benefitService.getEmployeeBenefits(tenantId, employeeId);
  }

  @Put(':id')
  async updateBenefit(
    @Param('id') benefitId: string,
    @Body() data: any,
    @Headers('x-tenant-id') tenantId: string,
  ) {
    return this.benefitService.updateBenefit(tenantId, benefitId, data);
  }

  @Delete(':id')
  async terminateBenefit(
    @Param('id') benefitId: string,
    @Headers('x-tenant-id') tenantId: string,
  ) {
    return this.benefitService.terminateBenefit(tenantId, benefitId);
  }
}
