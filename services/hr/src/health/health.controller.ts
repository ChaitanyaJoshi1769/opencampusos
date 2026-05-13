import { Controller, Get, HttpCode } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get()
  @HttpCode(200)
  health(): { status: string; message: string } {
    return { status: 'healthy', message: 'HR Service is running' };
  }

  @Get('ready')
  @HttpCode(200)
  ready(): { status: string; message: string } {
    return { status: 'ready', message: 'HR Service is ready to accept requests' };
  }
}
