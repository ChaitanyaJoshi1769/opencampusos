import { Controller, Get, Post, Body, Param, HttpCode } from '@nestjs/common';
import { DeveloperService, RegisterDeveloperDto } from '../services/developer.service';

@Controller('v1/developers')
export class DeveloperController {
  constructor(private readonly service: DeveloperService) {}

  @Post('register')
  @HttpCode(201)
  async register(@Body() dto: RegisterDeveloperDto): Promise<{ status: string; data: any }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const result = await this.service.registerDeveloper(tenantId, dto);
    return { status: 'success', data: result };
  }

  @Get(':id/profile')
  @HttpCode(200)
  async getProfile(@Param('id') id: string): Promise<{ status: string; data: any }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const profile = await this.service.getDeveloperProfile(tenantId, id);
    return { status: 'success', data: profile };
  }

  @Get()
  @HttpCode(200)
  async list(): Promise<{ status: string; data: any[] }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const developers = await this.service.listDevelopers(tenantId);
    return { status: 'success', data: developers };
  }

  @Post(':id/api-key')
  @HttpCode(201)
  async generateAPIKey(@Param('id') id: string): Promise<{ status: string; data: any }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const result = await this.service.generateAPIKey(tenantId, id);
    return { status: 'success', data: result };
  }

  @Get(':id/revenue')
  @HttpCode(200)
  async getRevenue(@Param('id') id: string): Promise<{ status: string; data: any }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const revenue = await this.service.getRevenue(tenantId, id);
    return { status: 'success', data: revenue };
  }
}
