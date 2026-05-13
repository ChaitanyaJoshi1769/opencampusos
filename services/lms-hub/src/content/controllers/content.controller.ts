import { Controller, Get, Post, Patch, Delete, Body, Param, Query, HttpCode } from '@nestjs/common';
import { ContentService, CreateContentDto } from '../services/content.service';

@Controller('v1/content')
export class ContentController {
  constructor(private readonly service: ContentService) {}

  @Post()
  @HttpCode(201)
  async create(@Body() dto: CreateContentDto): Promise<{ status: string; data: any }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const content = await this.service.createContent(tenantId, dto);

    return { status: 'success', data: content };
  }

  @Get()
  @HttpCode(200)
  async listByCourse(@Query('courseId') courseId: string): Promise<{ status: string; data: any[] }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const content = await this.service.listContentByCourse(tenantId, courseId);

    return { status: 'success', data: content };
  }

  @Get(':id')
  @HttpCode(200)
  async getContent(@Param('id') id: string): Promise<{ status: string; data: any }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const content = await this.service.getContent(tenantId, id);

    return { status: 'success', data: content };
  }

  @Patch(':id')
  @HttpCode(200)
  async update(
    @Param('id') id: string,
    @Body() dto: Partial<CreateContentDto>,
  ): Promise<{ status: string; data: any }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const content = await this.service.updateContent(tenantId, id, dto);

    return { status: 'success', data: content };
  }

  @Delete(':id')
  @HttpCode(200)
  async delete(@Param('id') id: string): Promise<{ status: string; message: string }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    await this.service.deleteContent(tenantId, id);

    return { status: 'success', message: 'Content deleted successfully' };
  }
}
