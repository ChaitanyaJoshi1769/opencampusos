import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get('/live')
  healthLive() {
    return { status: 'ok', service: 'surveys' };
  }

  @Get('/ready')
  healthReady() {
    return { status: 'ready', service: 'surveys' };
  }

  @Get()
  health() {
    return { status: 'healthy', service: 'surveys', timestamp: new Date() };
  }
}
