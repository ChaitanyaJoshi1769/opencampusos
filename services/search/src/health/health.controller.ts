import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get('/live')
  healthLive() {
    return { status: 'ok', service: 'search' };
  }

  @Get('/ready')
  healthReady() {
    return { status: 'ready', service: 'search' };
  }

  @Get()
  health() {
    return { status: 'healthy', service: 'search', timestamp: new Date() };
  }
}
