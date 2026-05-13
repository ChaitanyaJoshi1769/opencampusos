import { Controller, Get, Post, Delete, Param, Body, Headers, Query } from '@nestjs/common';
import { SearchService } from '../services/search.service';

@Controller('search')
export class SearchController {
  constructor(private searchService: SearchService) {}

  @Get()
  async search(
    @Headers('x-tenant-id') tenantId: string,
    @Query('q') query: string,
    @Query('type') type?: string,
    @Query('limit') limit = 10,
    @Query('offset') offset = 0,
  ) {
    return this.searchService.search(tenantId, query, type, limit, offset);
  }

  @Get('faceted')
  async facetedSearch(
    @Headers('x-tenant-id') tenantId: string,
    @Query('q') query: string,
    @Query('facets') facets: string,
  ) {
    const facetArray = facets ? facets.split(',') : [];
    return this.searchService.facetedSearch(tenantId, query, facetArray);
  }

  @Get('autocomplete')
  async autocomplete(
    @Headers('x-tenant-id') tenantId: string,
    @Query('prefix') prefix: string,
    @Query('type') type?: string,
  ) {
    return this.searchService.autocomplete(tenantId, prefix, type);
  }

  @Get('semantic')
  async semanticSearch(
    @Headers('x-tenant-id') tenantId: string,
    @Query('q') query: string,
    @Query('limit') limit = 10,
  ) {
    return this.searchService.semanticSearch(tenantId, query, limit);
  }

  @Post('documents/:docId')
  async indexDocument(
    @Headers('x-tenant-id') tenantId: string,
    @Param('docId') docId: string,
    @Body() body: any,
  ) {
    return this.searchService.indexDocument(tenantId, docId, body);
  }

  @Delete('documents/:docId')
  async deleteDocument(
    @Headers('x-tenant-id') tenantId: string,
    @Param('docId') docId: string,
  ) {
    return this.searchService.deleteDocument(tenantId, docId);
  }

  @Get('stats')
  async getStats(
    @Headers('x-tenant-id') tenantId: string,
  ) {
    return this.searchService.getSearchStats(tenantId);
  }
}
