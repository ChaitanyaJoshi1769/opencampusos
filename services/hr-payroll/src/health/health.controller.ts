import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get()
  health() {
    return { status: 'up', service: 'hr-payroll' };
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
