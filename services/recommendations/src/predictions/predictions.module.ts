import { Module } from '@nestjs/common';
import { PredictionService } from './services/prediction.service';
import { PredictionController } from './controllers/prediction.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [PredictionService],
  controllers: [PredictionController],
})
export class PredictionsModule {}
