import { Controller, Get } from '@nestjs/common';

@Controller('metrics')
export class MetricsController {
  @Get()
  metrics() {
    // Placeholder for Prometheus metrics
    // In production, integrate with @willsoto/nestjs-prometheus
    return {
      timestamp: new Date().toISOString(),
      service: 'api-gateway',
      metrics: {
        requestsTotal: 0,
        requestsDuration: 0,
        errorsTotal: 0,
      },
    };
  }
}
