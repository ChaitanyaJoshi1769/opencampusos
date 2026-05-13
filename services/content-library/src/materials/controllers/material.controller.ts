import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Headers,
} from '@nestjs/common';
import { MaterialService } from '../services/material.service';

@Controller('materials')
export class MaterialController {
  constructor(private materialService: MaterialService) {}

  @Post()
  async upload(
    @Headers('x-tenant-id') tenantId: string,
    @Body() body: any,
  ) {
    return this.materialService.uploadMaterial(tenantId, body);
  }

  @Get('resources/:resourceId')
  async getMaterials(
    @Headers('x-tenant-id') tenantId: string,
    @Param('resourceId') resourceId: string,
  ) {
    return this.materialService.getMaterials(tenantId, resourceId);
  }

  @Delete(':materialId')
  async delete(
    @Headers('x-tenant-id') tenantId: string,
    @Param('materialId') materialId: string,
  ) {
    return this.materialService.deleteMaterial(tenantId, materialId);
  }

  @Post(':materialId/download')
  async trackDownload(
    @Headers('x-tenant-id') tenantId: string,
    @Headers('x-user-id') userId: string,
    @Param('materialId') materialId: string,
  ) {
    return this.materialService.trackDownload(tenantId, materialId, userId);
  }

  @Get(':materialId/stats')
  async getStats(
    @Headers('x-tenant-id') tenantId: string,
    @Param('materialId') materialId: string,
  ) {
    return this.materialService.getDownloadStats(tenantId, materialId);
  }
}
