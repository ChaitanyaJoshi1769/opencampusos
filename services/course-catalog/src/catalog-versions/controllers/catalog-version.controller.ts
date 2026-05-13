import { Controller, Get, Post, Body, Param, Headers } from '@nestjs/common';
import { CatalogVersionService } from '../services/catalog-version.service';

@Controller('catalog-versions')
export class CatalogVersionController {
  constructor(private catalogService: CatalogVersionService) {}

  @Post()
  async createVersion(@Body() data: any, @Headers('x-tenant-id') tenantId: string) {
    return this.catalogService.createVersion(tenantId, data);
  }

  @Get()
  async listVersions(@Headers('x-tenant-id') tenantId: string) {
    return this.catalogService.listVersions(tenantId);
  }

  @Get('active')
  async getActiveCatalog(@Headers('x-tenant-id') tenantId: string) {
    return this.catalogService.getActiveCatalog(tenantId);
  }

  @Get('history')
  async getCatalogHistory(@Headers('x-tenant-id') tenantId: string) {
    return this.catalogService.getCatalogHistory(tenantId);
  }

  @Get(':id')
  async getVersion(
    @Param('id') versionId: string,
    @Headers('x-tenant-id') tenantId: string,
  ) {
    return this.catalogService.getVersion(tenantId, versionId);
  }

  @Post(':id/publish')
  async publishVersion(
    @Param('id') versionId: string,
    @Headers('x-tenant-id') tenantId: string,
  ) {
    return this.catalogService.publishVersion(tenantId, versionId);
  }

  @Post(':id/duplicate')
  async duplicateVersion(
    @Param('id') versionId: string,
    @Body() body: { academicYear: string },
    @Headers('x-tenant-id') tenantId: string,
  ) {
    return this.catalogService.duplicateVersion(tenantId, versionId, body.academicYear);
  }
}
