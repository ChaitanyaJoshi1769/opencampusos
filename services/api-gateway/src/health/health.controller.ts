import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get()
  health() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'api-gateway',
      version: '0.1.0',
    };
  }

  @Get('live')
  liveness() {
    return { alive: true };
  }

  @Get('ready')
  readiness() {
    return { ready: true };
  }
}
