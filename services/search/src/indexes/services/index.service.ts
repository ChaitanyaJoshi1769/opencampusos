import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Client } from '@elastic/elasticsearch';

@Injectable()
export class IndexService {
  private logger = new Logger(IndexService.name);
  private client: Client;

  constructor(private prisma: PrismaService) {
    this.client = new Client({
      node: process.env.ELASTICSEARCH_URL || 'http://localhost:9200',
    });
  }

  async createIndex(tenantId: string, indexName: string, mapping: any) {
    this.logger.log(`Creating index ${indexName}`);

    try {
      const exists = await this.client.indices.exists({ index: indexName });

      if (exists) {
        this.logger.log(`Index ${indexName} already exists`);
        return { created: false, exists: true };
      }

      await this.client.indices.create({
        index: indexName,
        body: mapping,
      });

      return { created: true, index: indexName };
    } catch (error) {
      this.logger.error(`Index creation error: ${error.message}`);
      return { created: false, error: error.message };
    }
  }

  async deleteIndex(indexName: string) {
    this.logger.log(`Deleting index ${indexName}`);

    try {
      await this.client.indices.delete({ index: indexName });
      return { deleted: true, index: indexName };
    } catch (error) {
      this.logger.error(`Index deletion error: ${error.message}`);
      return { deleted: false, error: error.message };
    }
  }

  async getIndexStats(indexName: string) {
    try {
      const stats = await this.client.indices.stats({ index: indexName });
      return stats.indices[indexName]?.primaries || {};
    } catch (error) {
      this.logger.error(`Index stats error: ${error.message}`);
      return {};
    }
  }

  async reindexData(sourceIndex: string, targetIndex: string) {
    this.logger.log(`Reindexing from ${sourceIndex} to ${targetIndex}`);

    try {
      const result = await this.client.reindex({
        body: {
          source: { index: sourceIndex },
          dest: { index: targetIndex },
        },
      });

      return {
        reindexed: true,
        batches: result.batches,
        updated: result.updated,
      };
    } catch (error) {
      this.logger.error(`Reindex error: ${error.message}`);
      return { reindexed: false, error: error.message };
    }
  }

  async listIndexes() {
    try {
      const indices = await this.client.indices.get({ index: 'opencampusos-*' });
      return Object.keys(indices);
    } catch (error) {
      this.logger.error(`List indexes error: ${error.message}`);
      return [];
    }
  }

  async refreshIndex(indexName: string) {
    this.logger.log(`Refreshing index ${indexName}`);

    try {
      await this.client.indices.refresh({ index: indexName });
      return { refreshed: true, index: indexName };
    } catch (error) {
      this.logger.error(`Refresh error: ${error.message}`);
      return { refreshed: false, error: error.message };
    }
  }

  async updateIndexSettings(indexName: string, settings: any) {
    this.logger.log(`Updating settings for ${indexName}`);

    try {
      await this.client.indices.putSettings({
        index: indexName,
        body: { settings },
      });

      return { updated: true, index: indexName };
    } catch (error) {
      this.logger.error(`Update settings error: ${error.message}`);
      return { updated: false, error: error.message };
    }
  }

  async getIndexMapping(indexName: string) {
    try {
      const mapping = await this.client.indices.getMapping({ index: indexName });
      return mapping[indexName]?.mappings || {};
    } catch (error) {
      this.logger.error(`Get mapping error: ${error.message}`);
      return {};
    }
  }
}
