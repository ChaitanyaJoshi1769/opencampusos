import { Controller, Get, Post, Delete, Body, Param, Query, HttpCode } from '@nestjs/common';
import { DocumentService, UploadDocumentDto } from '../services/document.service';

@Controller('v1/documents')
export class DocumentController {
  constructor(private readonly service: DocumentService) {}

  @Post('upload')
  @HttpCode(201)
  async uploadDocument(@Body() dto: UploadDocumentDto): Promise<{ status: string; data: any }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const document = await this.service.uploadDocument(tenantId, dto, Buffer.alloc(0));

    return { status: 'success', data: document };
  }

  @Get(':id')
  @HttpCode(200)
  async getDocument(@Param('id') id: string): Promise<{ status: string; data: any }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const document = await this.service.getDocument(tenantId, id);

    return { status: 'success', data: document };
  }

  @Get()
  @HttpCode(200)
  async listDocuments(
    @Query('entityId') relatedEntityId?: string,
    @Query('type') documentType?: string,
  ): Promise<{ status: string; data: any[] }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const documents = await this.service.listDocuments(tenantId, relatedEntityId, documentType);

    return { status: 'success', data: documents };
  }

  @Delete(':id')
  @HttpCode(200)
  async deleteDocument(@Param('id') id: string): Promise<{ status: string; message: string }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    await this.service.deleteDocument(tenantId, id);

    return { status: 'success', message: 'Document deleted successfully' };
  }

  @Get('search')
  @HttpCode(200)
  async searchDocuments(@Query('q') query: string): Promise<{ status: string; data: any[] }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const results = await this.service.searchDocuments(tenantId, query);

    return { status: 'success', data: results };
  }

  @Post(':id/tag')
  @HttpCode(200)
  async tagDocument(@Param('id') id: string, @Body() body: { tags: string[] }): Promise<{ status: string; data: any }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const result = await this.service.tagDocument(tenantId, id, body.tags);

    return { status: 'success', data: result };
  }

  @Post(':id/share')
  @HttpCode(201)
  async shareDocument(
    @Param('id') id: string,
    @Body() body: { recipients: string[]; expirationDays?: number },
  ): Promise<{ status: string; data: any }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const result = await this.service.shareDocument(tenantId, id, body.recipients, body.expirationDays);

    return { status: 'success', data: result };
  }

  @Get(':id/metadata')
  @HttpCode(200)
  async getMetadata(@Param('id') id: string): Promise<{ status: string; data: any }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const metadata = await this.service.getDocumentMetadata(tenantId, id);

    return { status: 'success', data: metadata };
  }
}
