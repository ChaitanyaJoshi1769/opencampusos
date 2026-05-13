import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import axios from 'axios';

@Injectable()
export class ConnectorService {
  private logger = new Logger(ConnectorService.name);
  private readonly supportedSystems = ['canvas', 'blackboard', 'banner', 'jira', 'github'];

  constructor(private prisma: PrismaService) {}

  async configureConnector(tenantId: string, system: string, config: any) {
    if (!this.supportedSystems.includes(system)) {
      throw new BadRequestException(`System ${system} is not supported`);
    }

    this.logger.log(`Configuring ${system} connector for tenant ${tenantId}`);

    const existing = await this.prisma.connector.findFirst({
      where: { tenantId, system },
    });

    if (existing) {
      return this.prisma.connector.update({
        where: { id: existing.id },
        data: {
          config,
          status: 'configured',
          lastSyncedAt: null,
        },
      });
    }

    return this.prisma.connector.create({
      data: {
        tenantId,
        system,
        config,
        status: 'configured',
      },
    });
  }

  async getConnector(tenantId: string, connectorId: string) {
    const connector = await this.prisma.connector.findFirst({
      where: {
        id: connectorId,
        tenantId,
      },
    });

    if (!connector) {
      throw new NotFoundException('Connector not found');
    }

    return connector;
  }

  async listConnectors(tenantId: string) {
    return this.prisma.connector.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async testConnection(tenantId: string, connectorId: string) {
    const connector = await this.getConnector(tenantId, connectorId);
    this.logger.log(`Testing ${connector.system} connection`);

    try {
      const isHealthy = await this.checkHealth(connector);

      const result = {
        healthy: isHealthy,
        system: connector.system,
        lastTested: new Date(),
      };

      if (isHealthy) {
        await this.prisma.connector.update({
          where: { id: connector.id },
          data: { status: 'connected' },
        });
      }

      return result;
    } catch (error) {
      this.logger.error(`Connection test failed: ${error.message}`);
      return {
        healthy: false,
        system: connector.system,
        error: error.message,
      };
    }
  }

  async deleteConnector(tenantId: string, connectorId: string) {
    const connector = await this.getConnector(tenantId, connectorId);
    return this.prisma.connector.delete({
      where: { id: connector.id },
    });
  }

  async getSyncStatus(tenantId: string, connectorId: string) {
    const connector = await this.getConnector(tenantId, connectorId);
    return {
      system: connector.system,
      status: connector.status,
      lastSyncedAt: connector.lastSyncedAt,
      createdAt: connector.createdAt,
      updatedAt: connector.updatedAt,
    };
  }

  async listSupportedSystems() {
    return this.supportedSystems.map((system) => ({
      name: system,
      displayName: this.getDisplayName(system),
    }));
  }

  private async checkHealth(connector: any): Promise<boolean> {
    const config = typeof connector.config === 'string' 
      ? JSON.parse(connector.config) 
      : connector.config;

    switch (connector.system) {
      case 'canvas':
        return await this.checkCanvasHealth(config);
      case 'blackboard':
        return await this.checkBlackboardHealth(config);
      case 'banner':
        return await this.checkBannerHealth(config);
      default:
        return true;
    }
  }

  private async checkCanvasHealth(config: any): Promise<boolean> {
    try {
      const response = await axios.get(`${config.baseUrl}/api/v1/accounts`, {
        headers: {
          Authorization: `Bearer ${config.apiToken}`,
        },
        timeout: 5000,
      });
      return response.status === 200;
    } catch (error) {
      return false;
    }
  }

  private async checkBlackboardHealth(config: any): Promise<boolean> {
    try {
      const response = await axios.post(
        `${config.baseUrl}/learn/api/public/v1/oauth2/token`,
        {
          grant_type: 'client_credentials',
        },
        {
          auth: {
            username: config.clientId,
            password: config.clientSecret,
          },
          timeout: 5000,
        },
      );
      return response.status === 200;
    } catch (error) {
      return false;
    }
  }

  private async checkBannerHealth(config: any): Promise<boolean> {
    try {
      const response = await axios.get(`${config.baseUrl}/banner/health`, {
        auth: {
          username: config.username,
          password: config.password,
        },
        timeout: 5000,
      });
      return response.status === 200;
    } catch (error) {
      return false;
    }
  }

  private getDisplayName(system: string): string {
    const names: { [key: string]: string } = {
      canvas: 'Canvas LMS',
      blackboard: 'Blackboard Learn',
      banner: 'Banner Student System',
      jira: 'Jira Cloud',
      github: 'GitHub Enterprise',
    };
    return names[system] || system;
  }
}
