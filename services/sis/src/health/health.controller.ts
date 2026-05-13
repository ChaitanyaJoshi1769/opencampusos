import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get()
  health() {
    return { status: 'ok', service: 'sis-service', version: '0.1.0' };
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
