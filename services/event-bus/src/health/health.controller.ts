import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get('/live')
  healthLive() {
    return { status: 'ok', service: 'event-bus' };
  }

  @Get('/ready')
  healthReady() {
    return { status: 'ready', service: 'event-bus' };
  }

  @Get()
  health() {
    return { status: 'healthy', service: 'event-bus', timestamp: new Date() };
  }
}
