import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get()
  health() {
    return { status: 'up', service: 'room-scheduling' };
  }

  @Get('live')
  live() {
    return { status: 'live' };
  }

  @Get('ready')
  ready() {
    return { status: 'ready' };
  }
}
