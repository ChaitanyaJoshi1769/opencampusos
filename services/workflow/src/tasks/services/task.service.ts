import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TaskService {
  private logger = new Logger(TaskService.name);

  constructor(private prisma: PrismaService) {}

  async createTask(tenantId: string, data: any) {
    this.logger.log(`Creating task for tenant ${tenantId}`);
    return this.prisma.task.create({
      data: {
        ...data,
        tenantId,
        status: 'pending',
      },
    });
  }

  async getTask(tenantId: string, taskId: string) {
    const task = await this.prisma.task.findFirst({
      where: {
        id: taskId,
        tenantId,
      },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }

  async listTasks(tenantId: string, assignedTo?: string, status?: string) {
    const where: any = { tenantId };
    if (assignedTo) {
      where.assignedTo = assignedTo;
    }
    if (status) {
      where.status = status;
    }

    return this.prisma.task.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateTask(tenantId: string, taskId: string, data: any) {
    const task = await this.getTask(tenantId, taskId);
    return this.prisma.task.update({
      where: { id: taskId },
      data,
    });
  }

  async assignTask(tenantId: string, taskId: string, assignedTo: string) {
    return this.updateTask(tenantId, taskId, { assignedTo });
  }

  async completeTask(tenantId: string, taskId: string, result: any) {
    return this.updateTask(tenantId, taskId, {
      status: 'completed',
      completedAt: new Date(),
      result,
    });
  }

  async getMyTasks(tenantId: string, userId: string, status?: string) {
    const where: any = {
      tenantId,
      assignedTo: userId,
    };
    if (status) {
      where.status = status;
    }

    return this.prisma.task.findMany({
      where,
      orderBy: { dueDate: 'asc' },
    });
  }

  async getOverdueTasks(tenantId: string) {
    const now = new Date();
    return this.prisma.task.findMany({
      where: {
        tenantId,
        dueDate: {
          lt: now,
        },
        status: { not: 'completed' },
      },
    });
  }
}
