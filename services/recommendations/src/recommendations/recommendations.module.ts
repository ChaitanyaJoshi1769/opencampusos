import { Module } from '@nestjs/common';
import { RecommendationService } from './services/recommendation.service';
import { RecommendationController } from './controllers/recommendation.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [RecommendationService],
  controllers: [RecommendationController],
})
export class RecommendationsModule {}
