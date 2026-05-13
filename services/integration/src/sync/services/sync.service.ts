import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class SyncService {
  private logger = new Logger(SyncService.name);

  constructor(private prisma: PrismaService) {}

  async startSync(tenantId: string, connectorId: string, entityType: string) {
    this.logger.log(`Starting sync for ${entityType} from connector ${connectorId}`);

    const sync = await this.prisma.syncJob.create({
      data: {
        tenantId,
        connectorId,
        entityType,
        status: 'running',
        startedAt: new Date(),
      },
    });

    // Simulate async sync
    setImmediate(() => {
      this.executeSyncJob(sync.id, tenantId, connectorId, entityType);
    });

    return sync;
  }

  async getSyncJob(tenantId: string, jobId: string) {
    const job = await this.prisma.syncJob.findFirst({
      where: {
        id: jobId,
        tenantId,
      },
    });

    if (!job) {
      throw new NotFoundException('Sync job not found');
    }

    return job;
  }

  async listSyncJobs(tenantId: string, connectorId?: string, limit = 10, offset = 0) {
    const where: any = { tenantId };
    if (connectorId) {
      where.connectorId = connectorId;
    }

    const [jobs, total] = await Promise.all([
      this.prisma.syncJob.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      this.prisma.syncJob.count({ where }),
    ]);

    return { jobs, total, limit, offset };
  }

  async getSyncStats(tenantId: string, connectorId: string) {
    const jobs = await this.prisma.syncJob.findMany({
      where: {
        tenantId,
        connectorId,
      },
    });

    const completed = jobs.filter((j) => j.status === 'completed').length;
    const failed = jobs.filter((j) => j.status === 'failed').length;
    const running = jobs.filter((j) => j.status === 'running').length;

    return {
      connectorId,
      totalJobs: jobs.length,
      completed,
      failed,
      running,
      successRate: jobs.length > 0 ? (completed / jobs.length) * 100 : 0,
    };
  }

  async getSyncHistory(tenantId: string, connectorId: string, days: number = 30) {
    const since = new Date();
    since.setDate(since.getDate() - days);

    const history = await this.prisma.syncJob.findMany({
      where: {
        tenantId,
        connectorId,
        createdAt: {
          gte: since,
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return {
      connectorId,
      period: `${days} days`,
      jobs: history,
    };
  }

  async cancelSync(tenantId: string, jobId: string) {
    const job = await this.getSyncJob(tenantId, jobId);

    if (job.status === 'completed' || job.status === 'failed') {
      throw new Error('Cannot cancel completed or failed sync');
    }

    return this.prisma.syncJob.update({
      where: { id: jobId },
      data: {
        status: 'cancelled',
        completedAt: new Date(),
      },
    });
  }

  private async executeSyncJob(jobId: string, tenantId: string, connectorId: string, entityType: string) {
    try {
      this.logger.log(`Executing sync job ${jobId}`);

      // Simulate data processing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const recordsProcessed = Math.floor(Math.random() * 1000);

      await this.prisma.syncJob.update({
        where: { id: jobId },
        data: {
          status: 'completed',
          completedAt: new Date(),
          recordsProcessed,
          recordsSucceeded: recordsProcessed,
          recordsFailed: 0,
        },
      });

      this.logger.log(`Sync job ${jobId} completed successfully`);
    } catch (error) {
      this.logger.error(`Sync job ${jobId} failed: ${error.message}`);

      await this.prisma.syncJob.update({
        where: { id: jobId },
        data: {
          status: 'failed',
          completedAt: new Date(),
          error: error.message,
        },
      });
    }
  }
}
