import { Controller, Get, Post, Body, Param, HttpCode } from '@nestjs/common';
import { ExecutionService, ExecuteWorkflowDto } from '../services/execution.service';

@Controller('v1/executions')
export class ExecutionController {
  constructor(private readonly service: ExecutionService) {}

  @Post()
  @HttpCode(201)
  async execute(@Body() dto: ExecuteWorkflowDto): Promise<{ status: string; data: any }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const execution = await this.service.executeWorkflow(tenantId, dto);

    return { status: 'success', data: execution };
  }

  @Get()
  @HttpCode(200)
  async list(
    @Param('workflowId') workflowId?: string,
  ): Promise<{ status: string; data: any[] }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const executions = await this.service.listExecutions(tenantId, workflowId);

    return { status: 'success', data: executions };
  }

  @Get('statistics')
  @HttpCode(200)
  async getStatistics(): Promise<{ status: string; data: any }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const stats = await this.service.getExecutionStatistics(tenantId);

    return { status: 'success', data: stats };
  }

  @Get(':id')
  @HttpCode(200)
  async getExecution(
    @Param('id') id: string,
  ): Promise<{ status: string; data: any }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const execution = await this.service.getExecution(tenantId, id);

    return { status: 'success', data: execution };
  }

  @Get(':id/history')
  @HttpCode(200)
  async getHistory(
    @Param('id') id: string,
  ): Promise<{ status: string; data: any[] }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const history = await this.service.getExecutionHistory(tenantId, id);

    return { status: 'success', data: history };
  }

  @Post(':id/pause')
  @HttpCode(200)
  async pause(
    @Param('id') id: string,
  ): Promise<{ status: string; data: any }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const execution = await this.service.pauseExecution(tenantId, id);

    return { status: 'success', data: execution };
  }

  @Post(':id/resume')
  @HttpCode(200)
  async resume(
    @Param('id') id: string,
  ): Promise<{ status: string; data: any }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const execution = await this.service.resumeExecution(tenantId, id);

    return { status: 'success', data: execution };
  }

  @Post(':id/cancel')
  @HttpCode(200)
  async cancel(
    @Param('id') id: string,
  ): Promise<{ status: string; data: any }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const execution = await this.service.cancelExecution(tenantId, id);

    return { status: 'success', data: execution };
  }
}
