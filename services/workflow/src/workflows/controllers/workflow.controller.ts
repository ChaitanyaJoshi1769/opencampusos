import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Headers,
  Query,
} from '@nestjs/common';
import { WorkflowService } from '../services/workflow.service';

@Controller('workflows')
export class WorkflowController {
  constructor(private workflowService: WorkflowService) {}

  @Post()
  async createWorkflow(
    @Headers('x-tenant-id') tenantId: string,
    @Body() body: any,
  ) {
    return this.workflowService.createWorkflow(tenantId, body);
  }

  @Get(':workflowId')
  async getWorkflow(
    @Headers('x-tenant-id') tenantId: string,
    @Param('workflowId') workflowId: string,
  ) {
    return this.workflowService.getWorkflow(tenantId, workflowId);
  }

  @Get()
  async listWorkflows(
    @Headers('x-tenant-id') tenantId: string,
    @Query('type') type?: string,
  ) {
    return this.workflowService.listWorkflows(tenantId, type);
  }

  @Patch(':workflowId')
  async updateWorkflow(
    @Headers('x-tenant-id') tenantId: string,
    @Param('workflowId') workflowId: string,
    @Body() body: any,
  ) {
    return this.workflowService.updateWorkflow(tenantId, workflowId, body);
  }

  @Post(':workflowId/publish')
  async publishWorkflow(
    @Headers('x-tenant-id') tenantId: string,
    @Param('workflowId') workflowId: string,
  ) {
    return this.workflowService.publishWorkflow(tenantId, workflowId);
  }

  @Delete(':workflowId')
  async deleteWorkflow(
    @Headers('x-tenant-id') tenantId: string,
    @Param('workflowId') workflowId: string,
  ) {
    return this.workflowService.deleteWorkflow(tenantId, workflowId);
  }

  @Post(':workflowId/steps')
  async addStep(
    @Headers('x-tenant-id') tenantId: string,
    @Param('workflowId') workflowId: string,
    @Body() body: any,
  ) {
    return this.workflowService.addWorkflowStep(tenantId, workflowId, body);
  }

  @Get(':workflowId/instances')
  async getInstances(
    @Headers('x-tenant-id') tenantId: string,
    @Param('workflowId') workflowId: string,
  ) {
    return this.workflowService.getWorkflowInstances(tenantId, workflowId);
  }

  @Post(':workflowId/start')
  async startInstance(
    @Headers('x-tenant-id') tenantId: string,
    @Param('workflowId') workflowId: string,
    @Body() body: any,
  ) {
    return this.workflowService.startWorkflowInstance(tenantId, workflowId, body.context);
  }

  @Get(':workflowId/stats')
  async getStats(
    @Headers('x-tenant-id') tenantId: string,
    @Param('workflowId') workflowId: string,
  ) {
    return this.workflowService.getWorkflowStats(tenantId, workflowId);
  }
}
