import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get('/live')
  healthLive() {
    return { status: 'ok', service: 'mobile-gateway' };
  }

  @Get('/ready')
  healthReady() {
    return { status: 'ready', service: 'mobile-gateway' };
  }

  @Get()
  health() {
    return { status: 'healthy', service: 'mobile-gateway', timestamp: new Date() };
  }
}
