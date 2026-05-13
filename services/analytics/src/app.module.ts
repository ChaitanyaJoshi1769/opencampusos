import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { HealthModule } from './health/health.module';
import { DashboardsModule } from './dashboards/dashboards.module';
import { MetricsModule } from './metrics/metrics.module';
import { KpisModule } from './kpis/kpis.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ['.env.local', '.env'] }),
    PrismaModule,
    HealthModule,
    DashboardsModule,
    MetricsModule,
    KpisModule,
  ],
})
export class AppModule {}
