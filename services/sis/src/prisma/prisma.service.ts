import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  async onModuleInit() {
    this.logger.log('Connecting to database...');
    await this.$connect();
    this.logger.log('✅ Database connected');

    // Set tenant context for multi-tenancy
    this.$use(async (params, next) => {
      // Add tenant_id to all queries if not already present
      if (params.action === 'create' || params.action === 'update') {
        if (!params.data.tenantId && process.env.CURRENT_TENANT_ID) {
          params.data.tenantId = process.env.CURRENT_TENANT_ID;
        }
      }
      return next(params);
    });
  }

  async onModuleDestroy() {
    this.logger.log('Disconnecting from database...');
    await this.$disconnect();
  }

  async setTenantContext(tenantId: string) {
    process.env.CURRENT_TENANT_ID = tenantId;
  }

  // Enable request-scoped tenant isolation
  async withTenant<T>(tenantId: string, fn: () => Promise<T>): Promise<T> {
    const previousTenant = process.env.CURRENT_TENANT_ID;
    try {
      await this.setTenantContext(tenantId);
      return await fn();
    } finally {
      process.env.CURRENT_TENANT_ID = previousTenant;
    }
  }
}
