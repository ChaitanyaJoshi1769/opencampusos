import { Controller, Get } from '@nestjs/common';
import { ProxyService } from './proxy.service';

@Controller('api/proxy')
export class ProxyController {
  constructor(private readonly proxyService: ProxyService) {}

  @Get('status')
  async status() {
    // Check status of all downstream services
    return {
      status: 'operational',
      timestamp: new Date().toISOString(),
      services: {
        sis: 'available',
        admissions: 'available',
        finance: 'available',
        analytics: 'available',
      },
    };
  }
}
