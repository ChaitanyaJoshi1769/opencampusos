import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface RegisterDeveloperDto {
  email: string;
  name: string;
  organization?: string;
  website?: string;
}

@Injectable()
export class DeveloperService {
  private readonly logger = new Logger(DeveloperService.name);

  constructor(private readonly prisma: PrismaService) {}

  async registerDeveloper(tenantId: string, dto: RegisterDeveloperDto): Promise<any> {
    if (!dto.email || !dto.name) {
      throw new BadRequestException('email and name are required');
    }

    const developer = {
      id: 'DEV-' + Date.now(),
      tenantId,
      ...dto,
      status: 'active',
      apiKey: Math.random().toString(36).substr(2, 32),
      registeredAt: new Date(),
    };

    this.logger.log(`✅ Registered developer: ${developer.id} - ${dto.name}`);
    return developer;
  }

  async getDeveloperProfile(tenantId: string, developerId: string): Promise<any> {
    return {
      id: developerId,
      name: 'Sample Developer',
      email: 'dev@example.com',
      plugins: 5,
      totalDownloads: 5000,
      revenue: 15000,
    };
  }

  async listDevelopers(tenantId: string): Promise<any[]> {
    return [];
  }

  async generateAPIKey(tenantId: string, developerId: string): Promise<any> {
    return {
      apiKey: Math.random().toString(36).substr(2, 32),
      developerId,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    };
  }

  async getRevenue(tenantId: string, developerId: string): Promise<any> {
    return {
      developerId,
      totalRevenue: 25000,
      thisMonth: 3500,
      pendingPayment: 1200,
      lastPayment: new Date(),
    };
  }
}
