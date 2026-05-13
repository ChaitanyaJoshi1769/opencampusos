import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class WorkflowService {
  private logger = new Logger(WorkflowService.name);

  constructor(private prisma: PrismaService) {}

  async createWorkflow(tenantId: string, data: any) {
    this.logger.log(`Creating workflow ${data.name} for tenant ${tenantId}`);

    return this.prisma.workflow.create({
      data: {
        ...data,
        tenantId,
        status: 'draft',
      },
    });
  }

  async getWorkflow(tenantId: string, workflowId: string) {
    const workflow = await this.prisma.workflow.findFirst({
      where: {
        id: workflowId,
        tenantId,
      },
      include: {
        steps: true,
      },
    });

    if (!workflow) {
      throw new NotFoundException('Workflow not found');
    }

    return workflow;
  }

  async listWorkflows(tenantId: string, type?: string) {
    const where: any = { tenantId };
    if (type) {
      where.type = type;
    }

    return this.prisma.workflow.findMany({
      where,
      include: { steps: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateWorkflow(tenantId: string, workflowId: string, data: any) {
    const workflow = await this.getWorkflow(tenantId, workflowId);

    if (workflow.status === 'published') {
      throw new BadRequestException('Cannot edit published workflow');
    }

    return this.prisma.workflow.update({
      where: { id: workflowId },
      data,
      include: { steps: true },
    });
  }

  async publishWorkflow(tenantId: string, workflowId: string) {
    const workflow = await this.getWorkflow(tenantId, workflowId);

    if (workflow.status === 'published') {
      throw new BadRequestException('Workflow is already published');
    }

    return this.prisma.workflow.update({
      where: { id: workflowId },
      data: { status: 'published', publishedAt: new Date() },
      include: { steps: true },
    });
  }

  async deleteWorkflow(tenantId: string, workflowId: string) {
    const workflow = await this.getWorkflow(tenantId, workflowId);
    return this.prisma.workflow.delete({
      where: { id: workflowId },
    });
  }

  async addWorkflowStep(tenantId: string, workflowId: string, stepData: any) {
    const workflow = await this.getWorkflow(tenantId, workflowId);

    return this.prisma.workflowStep.create({
      data: {
        ...stepData,
        workflowId: workflow.id,
        tenantId,
      },
    });
  }

  async getWorkflowInstances(tenantId: string, workflowId: string) {
    return this.prisma.workflowInstance.findMany({
      where: {
        tenantId,
        workflowId,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async startWorkflowInstance(tenantId: string, workflowId: string, context: any) {
    const workflow = await this.getWorkflow(tenantId, workflowId);

    if (workflow.status !== 'published') {
      throw new BadRequestException('Workflow must be published to create instances');
    }

    const instance = await this.prisma.workflowInstance.create({
      data: {
        tenantId,
        workflowId,
        status: 'running',
        context,
        startedAt: new Date(),
      },
    });

    this.logger.log(`Started workflow instance ${instance.id}`);
    return instance;
  }

  async completeWorkflowStep(tenantId: string, instanceId: string, stepId: string, result: any) {
    this.logger.log(`Completing step ${stepId} in instance ${instanceId}`);

    return this.prisma.workflowInstance.update({
      where: { id: instanceId },
      data: {
        currentStepId: null,
        completedAt: new Date(),
        status: 'completed',
      },
    });
  }

  async getWorkflowStats(tenantId: string, workflowId: string) {
    const instances = await this.prisma.workflowInstance.findMany({
      where: {
        tenantId,
        workflowId,
      },
    });

    const completed = instances.filter((i) => i.status === 'completed').length;
    const running = instances.filter((i) => i.status === 'running').length;
    const failed = instances.filter((i) => i.status === 'failed').length;

    return {
      workflowId,
      totalInstances: instances.length,
      completed,
      running,
      failed,
      successRate: instances.length > 0 ? (completed / instances.length) * 100 : 0,
    };
  }
}
