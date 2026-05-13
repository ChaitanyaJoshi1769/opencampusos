import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get('/live')
  healthLive() {
    return { status: 'ok', service: 'integration' };
  }

  @Get('/ready')
  healthReady() {
    return { status: 'ready', service: 'integration' };
  }

  @Get()
  health() {
    return { status: 'healthy', service: 'integration', timestamp: new Date() };
  }
}
