import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { HealthModule } from './health/health.module';
import { BudgetsModule } from './budgets/budgets.module';
import { CostsModule } from './costs/costs.module';
import { ForecastingModule } from './forecasting/forecasting.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ['.env.local', '.env'] }),
    PrismaModule,
    HealthModule,
    BudgetsModule,
    CostsModule,
    ForecastingModule,
  ],
})
export class AppModule {}
