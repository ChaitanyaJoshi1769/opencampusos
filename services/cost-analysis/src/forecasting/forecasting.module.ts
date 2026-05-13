import { Module } from '@nestjs/common';
import { ForecastService } from './services/forecast.service';
import { ForecastController } from './controllers/forecast.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [ForecastService],
  controllers: [ForecastController],
})
export class ForecastingModule {}
