import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Headers,
  Query,
} from '@nestjs/common';
import { SyncService } from '../services/sync.service';

@Controller('sync')
export class SyncController {
  constructor(private syncService: SyncService) {}

  @Post()
  async startSync(
    @Headers('x-tenant-id') tenantId: string,
    @Body() body: any,
  ) {
    return this.syncService.startSync(tenantId, body.connectorId, body.entityType);
  }

  @Get('jobs/:jobId')
  async getSyncJob(
    @Headers('x-tenant-id') tenantId: string,
    @Param('jobId') jobId: string,
  ) {
    return this.syncService.getSyncJob(tenantId, jobId);
  }

  @Get('jobs')
  async listSyncJobs(
    @Headers('x-tenant-id') tenantId: string,
    @Query('connectorId') connectorId?: string,
    @Query('limit') limit = 10,
    @Query('offset') offset = 0,
  ) {
    return this.syncService.listSyncJobs(tenantId, connectorId, limit, offset);
  }

  @Get('connectors/:connectorId/stats')
  async getSyncStats(
    @Headers('x-tenant-id') tenantId: string,
    @Param('connectorId') connectorId: string,
  ) {
    return this.syncService.getSyncStats(tenantId, connectorId);
  }

  @Get('connectors/:connectorId/history')
  async getSyncHistory(
    @Headers('x-tenant-id') tenantId: string,
    @Param('connectorId') connectorId: string,
    @Query('days') days = 30,
  ) {
    return this.syncService.getSyncHistory(tenantId, connectorId, days);
  }

  @Delete('jobs/:jobId')
  async cancelSync(
    @Headers('x-tenant-id') tenantId: string,
    @Param('jobId') jobId: string,
  ) {
    return this.syncService.cancelSync(tenantId, jobId);
  }
}
