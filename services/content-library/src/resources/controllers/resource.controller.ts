import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Headers,
  Query,
} from '@nestjs/common';
import { ResourceService } from '../services/resource.service';

@Controller('resources')
export class ResourceController {
  constructor(private resourceService: ResourceService) {}

  @Post()
  async create(
    @Headers('x-tenant-id') tenantId: string,
    @Body() body: any,
  ) {
    return this.resourceService.createResource(tenantId, body);
  }

  @Get(':resourceId')
  async get(
    @Headers('x-tenant-id') tenantId: string,
    @Param('resourceId') resourceId: string,
  ) {
    return this.resourceService.getResource(tenantId, resourceId);
  }

  @Get()
  async list(
    @Headers('x-tenant-id') tenantId: string,
    @Query('courseId') courseId?: string,
    @Query('type') type?: string,
  ) {
    return this.resourceService.listResources(tenantId, courseId, type);
  }

  @Get('search/:query')
  async search(
    @Headers('x-tenant-id') tenantId: string,
    @Param('query') query: string,
  ) {
    return this.resourceService.searchResources(tenantId, query);
  }

  @Patch(':resourceId/publish')
  async publish(
    @Headers('x-tenant-id') tenantId: string,
    @Param('resourceId') resourceId: string,
  ) {
    return this.resourceService.publishResource(tenantId, resourceId);
  }

  @Get('stats')
  async stats(
    @Headers('x-tenant-id') tenantId: string,
  ) {
    return this.resourceService.getResourceStats(tenantId);
  }
}
