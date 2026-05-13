import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get('/live')
  healthLive() {
    return { status: 'ok', service: 'student-success' };
  }

  @Get('/ready')
  healthReady() {
    return { status: 'ready', service: 'student-success' };
  }

  @Get()
  health() {
    return { status: 'healthy', service: 'student-success', timestamp: new Date() };
  }
}
