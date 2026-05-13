import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get('/live')
  healthLive() {
    return { status: 'ok', service: 'analytics' };
  }

  @Get('/ready')
  healthReady() {
    return { status: 'ready', service: 'analytics' };
  }

  @Get()
  health() {
    return { status: 'healthy', service: 'analytics', timestamp: new Date() };
  }
}
