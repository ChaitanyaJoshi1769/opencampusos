import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Client } from '@elastic/elasticsearch';

@Injectable()
export class SearchService {
  private logger = new Logger(SearchService.name);
  private client: Client;

  constructor(private prisma: PrismaService) {
    this.client = new Client({
      node: process.env.ELASTICSEARCH_URL || 'http://localhost:9200',
    });
  }

  async search(
    tenantId: string,
    query: string,
    type?: string,
    limit: number = 10,
    offset: number = 0,
  ) {
    this.logger.log(`Searching for: ${query}`);

    const must: any[] = [
      {
        multi_match: {
          query,
          fields: ['title^2', 'description', 'content'],
          fuzziness: 'AUTO',
        },
      },
    ];

    if (type) {
      must.push({ term: { type } });
    }

    must.push({ term: { tenantId } });

    try {
      const result = await this.client.search({
        index: `opencampusos-${tenantId}`,
        body: {
          query: { bool: { must } },
          from: offset,
          size: limit,
          highlight: {
            fields: { content: {}, description: {} },
          },
        },
      });

      return {
        results: result.hits.hits.map((hit: any) => ({
          id: hit._id,
          score: hit._score,
          ...hit._source,
          highlight: hit.highlight,
        })),
        total: result.hits.total,
        limit,
        offset,
      };
    } catch (error) {
      this.logger.error(`Search error: ${error.message}`);
      return { results: [], total: 0, limit, offset, error: error.message };
    }
  }

  async facetedSearch(
    tenantId: string,
    query: string,
    facets: string[],
    limit: number = 10,
  ) {
    this.logger.log(`Faceted search for: ${query}`);

    const aggs: any = {};
    facets.forEach((facet) => {
      aggs[facet] = { terms: { field: facet, size: 20 } };
    });

    try {
      const result = await this.client.search({
        index: `opencampusos-${tenantId}`,
        body: {
          query: {
            bool: {
              must: [
                {
                  multi_match: {
                    query,
                    fields: ['title', 'description', 'content'],
                  },
                },
                { term: { tenantId } },
              ],
            },
          },
          aggs,
          size: limit,
        },
      });

      return {
        results: result.hits.hits.map((hit: any) => ({ id: hit._id, ...hit._source })),
        facets: result.aggregations,
        total: result.hits.total,
      };
    } catch (error) {
      this.logger.error(`Faceted search error: ${error.message}`);
      return { results: [], facets: {}, total: 0, error: error.message };
    }
  }

  async autocomplete(tenantId: string, prefix: string, type?: string) {
    this.logger.log(`Autocomplete for prefix: ${prefix}`);

    try {
      const result = await this.client.search({
        index: `opencampusos-${tenantId}`,
        body: {
          query: {
            bool: {
              must: [
                {
                  match_phrase_prefix: {
                    title: {
                      query: prefix,
                      boost: 2,
                    },
                  },
                },
                { term: { tenantId } },
              ],
            },
          },
          _source: ['title', 'type', 'id'],
          size: 10,
        },
      });

      return result.hits.hits.map((hit: any) => ({
        id: hit._id,
        title: hit._source.title,
        type: hit._source.type,
      }));
    } catch (error) {
      this.logger.error(`Autocomplete error: ${error.message}`);
      return [];
    }
  }

  async semanticSearch(tenantId: string, query: string, limit: number = 10) {
    this.logger.log(`Semantic search for: ${query}`);
    // This would use embeddings from AI service
    const embedding = await this.getEmbedding(query);

    try {
      const result = await this.client.search({
        index: `opencampusos-${tenantId}`,
        body: {
          query: {
            bool: {
              must: [
                {
                  knn: {
                    embedding: {
                      vector: embedding,
                      k: limit,
                    },
                  },
                },
                { term: { tenantId } },
              ],
            },
          },
          size: limit,
        },
      });

      return result.hits.hits.map((hit: any) => ({
        id: hit._id,
        score: hit._score,
        ...hit._source,
      }));
    } catch (error) {
      this.logger.error(`Semantic search error: ${error.message}`);
      return [];
    }
  }

  private async getEmbedding(text: string): Promise<number[]> {
    // Mock embedding - would be replaced with actual AI service call
    return new Array(768).fill(0).map(() => Math.random());
  }

  async indexDocument(tenantId: string, docId: string, document: any) {
    this.logger.log(`Indexing document ${docId}`);

    try {
      await this.client.index({
        index: `opencampusos-${tenantId}`,
        id: docId,
        document: {
          ...document,
          tenantId,
          indexedAt: new Date(),
        },
      });

      return { indexed: true, docId };
    } catch (error) {
      this.logger.error(`Indexing error: ${error.message}`);
      return { indexed: false, error: error.message };
    }
  }

  async deleteDocument(tenantId: string, docId: string) {
    try {
      await this.client.delete({
        index: `opencampusos-${tenantId}`,
        id: docId,
      });

      return { deleted: true, docId };
    } catch (error) {
      this.logger.error(`Delete error: ${error.message}`);
      return { deleted: false, error: error.message };
    }
  }

  async getSearchStats(tenantId: string) {
    try {
      const stats = await this.client.indices.stats({
        index: `opencampusos-${tenantId}`,
      });

      return stats.indices[`opencampusos-${tenantId}`]?.primaries || {};
    } catch (error) {
      this.logger.error(`Stats error: ${error.message}`);
      return {};
    }
  }
}
