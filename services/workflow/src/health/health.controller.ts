import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get('/live')
  healthLive() {
    return { status: 'ok', service: 'workflow' };
  }

  @Get('/ready')
  healthReady() {
    return { status: 'ready', service: 'workflow' };
  }

  @Get()
  health() {
    return { status: 'healthy', service: 'workflow', timestamp: new Date() };
  }
}
