import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { NLQueryService } from '../services/nl-query.service';

@Controller('v1/query')
export class NLQueryController {
  constructor(private readonly service: NLQueryService) {}

  @Post('execute')
  @HttpCode(200)
  async executeQuery(
    @Body() body: { query: string },
  ): Promise<{ status: string; data: any }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const result = await this.service.processQuery(tenantId, body.query);

    return { status: 'success', data: result };
  }

  @Post('ask')
  @HttpCode(200)
  async askQuestion(
    @Body() body: { question: string },
  ): Promise<{ status: string; data: any }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const result = await this.service.askQuestion(tenantId, body.question);

    return { status: 'success', data: result };
  }

  @Post('insights')
  @HttpCode(200)
  async generateInsight(
    @Body() body: { topic: string },
  ): Promise<{ status: string; data: any }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const result = await this.service.generateInsight(tenantId, body.topic);

    return { status: 'success', data: result };
  }
}
