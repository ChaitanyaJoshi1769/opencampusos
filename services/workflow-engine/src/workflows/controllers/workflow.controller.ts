import { Controller, Get, Post, Patch, Delete, Body, Param, HttpCode } from '@nestjs/common';
import { WorkflowService, CreateWorkflowDto } from '../services/workflow.service';

@Controller('v1/workflows')
export class WorkflowController {
  constructor(private readonly service: WorkflowService) {}

  @Post()
  @HttpCode(201)
  async create(@Body() dto: CreateWorkflowDto): Promise<{ status: string; data: any }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const workflow = await this.service.createWorkflow(tenantId, dto);

    return { status: 'success', data: workflow };
  }

  @Get()
  @HttpCode(200)
  async list(): Promise<{ status: string; data: any[] }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const workflows = await this.service.listWorkflows(tenantId);

    return { status: 'success', data: workflows };
  }

  @Get('statistics')
  @HttpCode(200)
  async getStatistics(): Promise<{ status: string; data: any }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const stats = await this.service.getWorkflowStatistics(tenantId);

    return { status: 'success', data: stats };
  }

  @Get(':id')
  @HttpCode(200)
  async getWorkflow(
    @Param('id') id: string,
  ): Promise<{ status: string; data: any }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const workflow = await this.service.getWorkflow(tenantId, id);

    return { status: 'success', data: workflow };
  }

  @Patch(':id')
  @HttpCode(200)
  async update(
    @Param('id') id: string,
    @Body() dto: Partial<CreateWorkflowDto>,
  ): Promise<{ status: string; data: any }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const workflow = await this.service.updateWorkflow(tenantId, id, dto);

    return { status: 'success', data: workflow };
  }

  @Delete(':id')
  @HttpCode(200)
  async delete(
    @Param('id') id: string,
  ): Promise<{ status: string; message: string }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    await this.service.deleteWorkflow(tenantId, id);

    return { status: 'success', message: 'Workflow deleted successfully' };
  }
}
