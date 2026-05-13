import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class MaterialService {
  private logger = new Logger(MaterialService.name);

  constructor(private prisma: PrismaService) {}

  async uploadMaterial(tenantId: string, data: any) {
    this.logger.log(`Uploading material: ${data.filename}`);
    return this.prisma.material.create({
      data: {
        ...data,
        tenantId,
        uploadedAt: new Date(),
      },
    });
  }

  async getMaterials(tenantId: string, resourceId: string) {
    return this.prisma.material.findMany({
      where: { tenantId, resourceId },
      orderBy: { uploadedAt: 'desc' },
    });
  }

  async deleteMaterial(tenantId: string, materialId: string) {
    return this.prisma.material.delete({ where: { id: materialId } });
  }

  async trackDownload(tenantId: string, materialId: string, userId: string) {
    return this.prisma.materialDownload.create({
      data: { tenantId, materialId, userId, downloadedAt: new Date() },
    });
  }

  async getDownloadStats(tenantId: string, materialId: string) {
    const downloads = await this.prisma.materialDownload.findMany({
      where: { tenantId, materialId },
    });
    return {
      materialId,
      totalDownloads: downloads.length,
      uniqueUsers: new Set(downloads.map((d) => d.userId)).size,
    };
  }
}
