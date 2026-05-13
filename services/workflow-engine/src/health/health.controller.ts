import { Controller, Get, HttpCode } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get()
  @HttpCode(200)
  health(): { status: string; message: string } {
    return { status: 'healthy', message: 'Workflow Engine is running' };
  }

  @Get('ready')
  @HttpCode(200)
  ready(): { status: string; message: string } {
    return { status: 'ready', message: 'Workflow Engine is ready to accept requests' };
  }
}
