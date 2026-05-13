import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';

@Injectable()
export class ProxyService {
  private sisService: AxiosInstance;
  private admissionsService: AxiosInstance;
  private financeService: AxiosInstance;
  private analyticsService: AxiosInstance;

  constructor() {
    const baseConfig = {
      timeout: 10000,
      validateStatus: () => true, // Handle all status codes
    };

    this.sisService = axios.create({
      ...baseConfig,
      baseURL: process.env.SIS_SERVICE_URL || 'http://localhost:3002',
    });

    this.admissionsService = axios.create({
      ...baseConfig,
      baseURL: process.env.ADMISSIONS_SERVICE_URL || 'http://localhost:3003',
    });

    this.financeService = axios.create({
      ...baseConfig,
      baseURL: process.env.FINANCE_SERVICE_URL || 'http://localhost:3004',
    });

    this.analyticsService = axios.create({
      ...baseConfig,
      baseURL: process.env.ANALYTICS_SERVICE_URL || 'http://localhost:3007',
    });
  }

  getSISService(): AxiosInstance {
    return this.sisService;
  }

  getAdmissionsService(): AxiosInstance {
    return this.admissionsService;
  }

  getFinanceService(): AxiosInstance {
    return this.financeService;
  }

  getAnalyticsService(): AxiosInstance {
    return this.analyticsService;
  }
}
