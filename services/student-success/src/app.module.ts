import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { HealthModule } from './health/health.module';
import { AdvisingModule } from './advising/advising.module';
import { AlertsModule } from './alerts/alerts.module';
import { InterventionsModule } from './interventions/interventions.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ['.env.local', '.env'] }),
    PrismaModule,
    HealthModule,
    AdvisingModule,
    AlertsModule,
    InterventionsModule,
  ],
})
export class AppModule {}
