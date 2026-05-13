import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class LicenseService {
  private logger = new Logger(LicenseService.name);

  constructor(private prisma: PrismaService) {}

  async trackLicense(tenantId: string, data: any) {
    this.logger.log(`Tracking license for resource: ${data.resourceId}`);
    return this.prisma.license.create({
      data: { ...data, tenantId },
    });
  }

  async checkCompliance(tenantId: string, resourceId: string) {
    const license = await this.prisma.license.findFirst({
      where: { tenantId, resourceId },
    });

    if (!license) {
      return { compliant: false, message: 'No license found' };
    }

    const now = new Date();
    const isExpired = new Date(license.expiresAt) < now;

    return {
      compliant: !isExpired,
      license: license.type,
      expiresAt: license.expiresAt,
    };
  }

  async getLicenseReport(tenantId: string) {
    const licenses = await this.prisma.license.findMany({ where: { tenantId } });
    const now = new Date();
    const expired = licenses.filter((l) => new Date(l.expiresAt) < now).length;

    return {
      totalLicenses: licenses.length,
      expired,
      active: licenses.length - expired,
    };
  }

  async renewLicense(tenantId: string, licenseId: string, newExpiryDate: Date) {
    return this.prisma.license.update({
      where: { id: licenseId },
      data: { expiresAt: newExpiryDate },
    });
  }
}
