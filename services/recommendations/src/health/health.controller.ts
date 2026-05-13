import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get('/live')
  healthLive() {
    return { status: 'ok', service: 'recommendations' };
  }

  @Get('/ready')
  healthReady() {
    return { status: 'ready', service: 'recommendations' };
  }

  @Get()
  health() {
    return { status: 'healthy', service: 'recommendations', timestamp: new Date() };
  }
}
