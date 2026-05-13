import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get('/live')
  healthLive() {
    return { status: 'ok', service: 'content-library' };
  }

  @Get('/ready')
  healthReady() {
    return { status: 'ready', service: 'content-library' };
  }

  @Get()
  health() {
    return { status: 'healthy', service: 'content-library', timestamp: new Date() };
  }
}
