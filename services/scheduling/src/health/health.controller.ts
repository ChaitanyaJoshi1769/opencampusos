import { Controller, Get, HttpCode } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get()
  @HttpCode(200)
  getHealth(): { status: string; service: string; timestamp: string } {
    return {
      status: 'healthy',
      service: 'scheduling',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('live')
  @HttpCode(200)
  getLiveness(): { status: string } {
    return { status: 'alive' };
  }

  @Get('ready')
  @HttpCode(200)
  getReadiness(): { status: string; ready: boolean } {
    return { status: 'success', ready: true };
  }
}
