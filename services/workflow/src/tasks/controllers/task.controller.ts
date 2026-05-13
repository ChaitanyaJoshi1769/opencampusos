import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Headers,
  Query,
} from '@nestjs/common';
import { TaskService } from '../services/task.service';

@Controller('tasks')
export class TaskController {
  constructor(private taskService: TaskService) {}

  @Post()
  async createTask(
    @Headers('x-tenant-id') tenantId: string,
    @Body() body: any,
  ) {
    return this.taskService.createTask(tenantId, body);
  }

  @Get(':taskId')
  async getTask(
    @Headers('x-tenant-id') tenantId: string,
    @Param('taskId') taskId: string,
  ) {
    return this.taskService.getTask(tenantId, taskId);
  }

  @Get()
  async listTasks(
    @Headers('x-tenant-id') tenantId: string,
    @Query('assignedTo') assignedTo?: string,
    @Query('status') status?: string,
  ) {
    return this.taskService.listTasks(tenantId, assignedTo, status);
  }

  @Patch(':taskId')
  async updateTask(
    @Headers('x-tenant-id') tenantId: string,
    @Param('taskId') taskId: string,
    @Body() body: any,
  ) {
    return this.taskService.updateTask(tenantId, taskId, body);
  }

  @Post(':taskId/assign')
  async assignTask(
    @Headers('x-tenant-id') tenantId: string,
    @Param('taskId') taskId: string,
    @Body() body: { assignedTo: string },
  ) {
    return this.taskService.assignTask(tenantId, taskId, body.assignedTo);
  }

  @Post(':taskId/complete')
  async completeTask(
    @Headers('x-tenant-id') tenantId: string,
    @Param('taskId') taskId: string,
    @Body() body: any,
  ) {
    return this.taskService.completeTask(tenantId, taskId, body.result);
  }

  @Get('user/my-tasks')
  async getMyTasks(
    @Headers('x-tenant-id') tenantId: string,
    @Headers('x-user-id') userId: string,
    @Query('status') status?: string,
  ) {
    return this.taskService.getMyTasks(tenantId, userId, status);
  }

  @Get('user/overdue')
  async getOverdueTasks(
    @Headers('x-tenant-id') tenantId: string,
  ) {
    return this.taskService.getOverdueTasks(tenantId);
  }
}
