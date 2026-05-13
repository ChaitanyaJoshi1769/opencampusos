import { Controller, Get, Post, Body, Query, HttpCode } from '@nestjs/common';
import { SemanticSearchService } from '../services/semantic-search.service';

@Controller('v1/search')
export class SearchController {
  constructor(private readonly service: SemanticSearchService) {}

  @Get('students')
  @HttpCode(200)
  async searchStudents(
    @Query('q') query: string,
  ): Promise<{ status: string; data: any[] }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const results = await this.service.searchStudents(tenantId, query);

    return { status: 'success', data: results };
  }

  @Get('courses')
  @HttpCode(200)
  async searchCourses(
    @Query('q') query: string,
  ): Promise<{ status: string; data: any[] }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const results = await this.service.searchCourses(tenantId, query);

    return { status: 'success', data: results };
  }

  @Get('documents')
  @HttpCode(200)
  async searchDocuments(
    @Query('q') query: string,
  ): Promise<{ status: string; data: any[] }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const results = await this.service.searchDocuments(tenantId, query);

    return { status: 'success', data: results };
  }

  @Post('index')
  @HttpCode(200)
  async indexContent(
    @Body() body: { contentType: string; contentId: string; text: string },
  ): Promise<{ status: string; data: any }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const result = await this.service.indexContent(
      tenantId,
      body.contentType,
      body.contentId,
      body.text,
    );

    return { status: 'success', data: result };
  }
}
