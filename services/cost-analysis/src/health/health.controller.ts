import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get('/live')
  healthLive() {
    return { status: 'ok', service: 'cost-analysis' };
  }

  @Get('/ready')
  healthReady() {
    return { status: 'ready', service: 'cost-analysis' };
  }

  @Get()
  health() {
    return { status: 'healthy', service: 'cost-analysis', timestamp: new Date() };
  }
}
