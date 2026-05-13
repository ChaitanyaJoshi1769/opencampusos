import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CatalogVersionService {
  constructor(private prisma: PrismaService) {}

  async createVersion(tenantId: string, data: any) {
    return this.prisma.catalogVersion.create({
      data: {
        ...data,
        tenantId,
        status: 'draft',
      },
    });
  }

  async getVersion(tenantId: string, versionId: string) {
    return this.prisma.catalogVersion.findFirst({
      where: { id: versionId, tenantId },
    });
  }

  async listVersions(tenantId: string) {
    return this.prisma.catalogVersion.findMany({
      where: { tenantId },
      orderBy: { academicYear: 'desc' },
    });
  }

  async publishVersion(tenantId: string, versionId: string) {
    await this.prisma.catalogVersion.updateMany({
      where: { tenantId, status: 'active' },
      data: { status: 'archived' },
    });

    return this.prisma.catalogVersion.update({
      where: { id: versionId },
      data: { status: 'active', activatedAt: new Date() },
    });
  }

  async getActiveCatalog(tenantId: string) {
    return this.prisma.catalogVersion.findFirst({
      where: { tenantId, status: 'active' },
    });
  }

  async getCatalogHistory(tenantId: string) {
    return this.prisma.catalogVersion.findMany({
      where: { tenantId },
      orderBy: { activatedAt: 'desc' },
      take: 10,
    });
  }

  async duplicateVersion(tenantId: string, sourceVersionId: string, newYear: string) {
    const source = await this.getVersion(tenantId, sourceVersionId);
    if (!source) throw new Error('Source version not found');

    return this.prisma.catalogVersion.create({
      data: {
        tenantId,
        academicYear: newYear,
        description: `Copy of ${source.academicYear}`,
        status: 'draft',
      },
    });
  }
}
