import { Controller, Get, Post, Body, Param, Query, HttpCode } from '@nestjs/common';
import { TranscriptService, GenerateTranscriptDto } from '../services/transcript.service';

@Controller('v1/transcripts')
export class TranscriptController {
  constructor(private readonly service: TranscriptService) {}

  @Post('generate')
  @HttpCode(201)
  async generateTranscript(@Body() dto: GenerateTranscriptDto): Promise<{ status: string; data: any }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const transcript = await this.service.generateTranscript(tenantId, dto);

    return { status: 'success', data: transcript };
  }

  @Post('request')
  @HttpCode(201)
  async requestTranscript(
    @Body() body: { studentId: string; deliveryMethod: string },
  ): Promise<{ status: string; data: any }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const request = await this.service.requestTranscript(tenantId, body.studentId, body.deliveryMethod);

    return { status: 'success', data: request };
  }

  @Get(':id')
  @HttpCode(200)
  async getTranscript(@Param('id') id: string): Promise<{ status: string; data: any }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const transcript = await this.service.getTranscript(tenantId, id);

    return { status: 'success', data: transcript };
  }

  @Get()
  @HttpCode(200)
  async listTranscripts(@Query('studentId') studentId?: string): Promise<{ status: string; data: any[] }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const transcripts = await this.service.listTranscripts(tenantId, studentId);

    return { status: 'success', data: transcripts };
  }

  @Get(':studentId/degree-audit')
  @HttpCode(200)
  async getDegreeAudit(@Param('studentId') studentId: string): Promise<{ status: string; data: any }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const audit = await this.service.generateDegreeAudit(tenantId, studentId);

    return { status: 'success', data: audit };
  }

  @Get(':studentId/degree-verification')
  @HttpCode(200)
  async getDegreeVerification(@Param('studentId') studentId: string): Promise<{ status: string; data: any }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const verification = await this.service.generateDegreeVerification(tenantId, studentId);

    return { status: 'success', data: verification };
  }

  @Post('bulk-generate')
  @HttpCode(201)
  async bulkGenerateTranscripts(@Body() body: { studentIds: string[] }): Promise<{ status: string; data: any }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const result = await this.service.bulkGenerateTranscripts(tenantId, body.studentIds);

    return { status: 'success', data: result };
  }

  @Get(':transcriptId/status')
  @HttpCode(200)
  async getTranscriptStatus(@Param('transcriptId') transcriptId: string): Promise<{ status: string; data: any }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const status = await this.service.getTranscriptStatus(tenantId, transcriptId);

    return { status: 'success', data: status };
  }
}
