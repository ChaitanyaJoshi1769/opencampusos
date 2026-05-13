import { Controller, Get, Post, Delete, Param, Body, Query } from '@nestjs/common';
import { IndexService } from '../services/index.service';

@Controller('indexes')
export class IndexController {
  constructor(private indexService: IndexService) {}

  @Post()
  async createIndex(@Query('name') name: string, @Body() mapping: any) {
    const indexName = `opencampusos-${name}`;
    return this.indexService.createIndex(name, indexName, mapping);
  }

  @Delete(':indexName')
  async deleteIndex(@Param('indexName') indexName: string) {
    return this.indexService.deleteIndex(indexName);
  }

  @Get(':indexName/stats')
  async getIndexStats(@Param('indexName') indexName: string) {
    return this.indexService.getIndexStats(indexName);
  }

  @Post(':indexName/refresh')
  async refreshIndex(@Param('indexName') indexName: string) {
    return this.indexService.refreshIndex(indexName);
  }

  @Post(':indexName/reindex')
  async reindexData(
    @Param('indexName') sourceIndex: string,
    @Query('target') targetIndex: string,
  ) {
    return this.indexService.reindexData(sourceIndex, targetIndex);
  }

  @Get(':indexName/mapping')
  async getMapping(@Param('indexName') indexName: string) {
    return this.indexService.getIndexMapping(indexName);
  }

  @Post(':indexName/settings')
  async updateSettings(@Param('indexName') indexName: string, @Body() settings: any) {
    return this.indexService.updateIndexSettings(indexName, settings);
  }

  @Get()
  async listIndexes() {
    return this.indexService.listIndexes();
  }
}
