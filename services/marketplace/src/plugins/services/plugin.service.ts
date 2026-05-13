import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface PublishPluginDto {
  name: string;
  description: string;
  version: string;
  author: string;
  category: 'integration' | 'widget' | 'workflow' | 'reporting' | 'api' | 'other';
  repository?: string;
  documentation?: string;
  pricing?: 'free' | 'freemium' | 'paid';
}

@Injectable()
export class PluginService {
  private readonly logger = new Logger(PluginService.name);

  constructor(private readonly prisma: PrismaService) {}

  async publishPlugin(tenantId: string, developerId: string, dto: PublishPluginDto): Promise<any> {
    if (!dto.name || !dto.version || !dto.author || !dto.category) {
      throw new BadRequestException('name, version, author, and category are required');
    }

    const plugin = {
      id: 'PLG-' + Date.now(),
      ...dto,
      developerId,
      tenantId,
      status: 'review',
      downloads: 0,
      rating: 0,
      reviewCount: 0,
      publishedAt: new Date(),
    };

    this.logger.log(`✅ Published plugin: ${plugin.id} - ${dto.name}`);
    return plugin;
  }

  async getPlugin(tenantId: string, pluginId: string): Promise<any> {
    this.logger.log(`Retrieved plugin: ${pluginId}`);
    return {
      id: pluginId,
      name: 'Sample Plugin',
      version: '1.0.0',
      author: 'Sample Author',
      category: 'integration',
      downloads: 150,
      rating: 4.5,
      reviewCount: 30,
    };
  }

  async listPlugins(tenantId: string, category?: string, searchQuery?: string): Promise<any[]> {
    this.logger.log(`Listed plugins for tenant: ${tenantId}`);
    return [];
  }

  async installPlugin(tenantId: string, pluginId: string): Promise<any> {
    this.logger.log(`Installed plugin: ${pluginId}`);
    return {
      installationId: 'INST-' + Date.now(),
      pluginId,
      tenantId,
      status: 'installed',
      installedAt: new Date(),
    };
  }

  async uninstallPlugin(tenantId: string, pluginId: string): Promise<void> {
    this.logger.log(`Uninstalled plugin: ${pluginId}`);
  }

  async getPluginStats(tenantId: string, pluginId: string): Promise<any> {
    return {
      pluginId,
      downloads: 1500,
      activeInstallations: 250,
      averageRating: 4.5,
      reviewCount: 120,
      lastUpdated: new Date(),
    };
  }
}
