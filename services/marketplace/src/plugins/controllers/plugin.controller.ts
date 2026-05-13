import { Controller, Get, Post, Delete, Body, Param, Query, HttpCode } from '@nestjs/common';
import { PluginService, PublishPluginDto } from '../services/plugin.service';

@Controller('v1/plugins')
export class PluginController {
  constructor(private readonly service: PluginService) {}

  @Post('publish')
  @HttpCode(201)
  async publish(@Body() dto: PublishPluginDto): Promise<{ status: string; data: any }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const developerId = 'DEV-001';
    const result = await this.service.publishPlugin(tenantId, developerId, dto);
    return { status: 'success', data: result };
  }

  @Get(':id')
  @HttpCode(200)
  async getPlugin(@Param('id') id: string): Promise<{ status: string; data: any }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const plugin = await this.service.getPlugin(tenantId, id);
    return { status: 'success', data: plugin };
  }

  @Get()
  @HttpCode(200)
  async list(@Query('category') category?: string, @Query('q') q?: string): Promise<{ status: string; data: any[] }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const plugins = await this.service.listPlugins(tenantId, category, q);
    return { status: 'success', data: plugins };
  }

  @Post(':id/install')
  @HttpCode(201)
  async install(@Param('id') id: string): Promise<{ status: string; data: any }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const result = await this.service.installPlugin(tenantId, id);
    return { status: 'success', data: result };
  }

  @Delete(':id/uninstall')
  @HttpCode(200)
  async uninstall(@Param('id') id: string): Promise<{ status: string; message: string }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    await this.service.uninstallPlugin(tenantId, id);
    return { status: 'success', message: 'Plugin uninstalled successfully' };
  }

  @Get(':id/stats')
  @HttpCode(200)
  async getStats(@Param('id') id: string): Promise<{ status: string; data: any }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const stats = await this.service.getPluginStats(tenantId, id);
    return { status: 'success', data: stats };
  }
}
