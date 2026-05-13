import { Controller, Get, HttpCode } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get()
  @HttpCode(200)
  health(): { status: string; message: string } {
    return { status: 'healthy', message: 'ERP Service is running' };
  }

  @Get('ready')
  @HttpCode(200)
  ready(): { status: string; message: string } {
    return { status: 'ready', message: 'ERP Service is ready to accept requests' };
  }
}
