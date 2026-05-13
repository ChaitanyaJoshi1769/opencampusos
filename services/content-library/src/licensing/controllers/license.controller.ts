import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Headers,
} from '@nestjs/common';
import { LicenseService } from '../services/license.service';

@Controller('licenses')
export class LicenseController {
  constructor(private licenseService: LicenseService) {}

  @Post()
  async track(
    @Headers('x-tenant-id') tenantId: string,
    @Body() body: any,
  ) {
    return this.licenseService.trackLicense(tenantId, body);
  }

  @Get('resources/:resourceId/check')
  async check(
    @Headers('x-tenant-id') tenantId: string,
    @Param('resourceId') resourceId: string,
  ) {
    return this.licenseService.checkCompliance(tenantId, resourceId);
  }

  @Get('report')
  async getReport(
    @Headers('x-tenant-id') tenantId: string,
  ) {
    return this.licenseService.getLicenseReport(tenantId);
  }

  @Patch(':licenseId/renew')
  async renew(
    @Headers('x-tenant-id') tenantId: string,
    @Param('licenseId') licenseId: string,
    @Body() body: { expiresAt: string },
  ) {
    return this.licenseService.renewLicense(tenantId, licenseId, new Date(body.expiresAt));
  }
}
