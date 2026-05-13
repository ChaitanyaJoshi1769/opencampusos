import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ResourceService {
  private logger = new Logger(ResourceService.name);

  constructor(private prisma: PrismaService) {}

  async createResource(tenantId: string, data: any) {
    this.logger.log(`Creating resource: ${data.title}`);
    return this.prisma.resource.create({
      data: { ...data, tenantId, status: 'draft' },
    });
  }

  async getResource(tenantId: string, resourceId: string) {
    const resource = await this.prisma.resource.findFirst({
      where: { id: resourceId, tenantId },
    });
    if (!resource) throw new NotFoundException('Resource not found');
    return resource;
  }

  async listResources(tenantId: string, courseId?: string, type?: string) {
    const where: any = { tenantId, status: 'published' };
    if (courseId) where.courseId = courseId;
    if (type) where.type = type;

    return this.prisma.resource.findMany({ where, orderBy: { createdAt: 'desc' } });
  }

  async searchResources(tenantId: string, query: string) {
    this.logger.log(`Searching resources for: ${query}`);
    return this.prisma.resource.findMany({
      where: {
        tenantId,
        status: 'published',
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
        ],
      },
      take: 20,
    });
  }

  async publishResource(tenantId: string, resourceId: string) {
    return this.prisma.resource.update({
      where: { id: resourceId },
      data: { status: 'published', publishedAt: new Date() },
    });
  }

  async getResourceStats(tenantId: string) {
    const resources = await this.prisma.resource.findMany({ where: { tenantId } });
    return {
      total: resources.length,
      published: resources.filter((r) => r.status === 'published').length,
      draft: resources.filter((r) => r.status === 'draft').length,
    };
  }
}
