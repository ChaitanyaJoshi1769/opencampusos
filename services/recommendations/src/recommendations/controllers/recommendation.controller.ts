import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Headers,
  Query,
} from '@nestjs/common';
import { RecommendationService } from '../services/recommendation.service';

@Controller('recommendations')
export class RecommendationController {
  constructor(private recommendationService: RecommendationService) {}

  @Get('student/:studentId')
  async getRecommendations(
    @Headers('x-tenant-id') tenantId: string,
    @Param('studentId') studentId: string,
    @Query('limit') limit: number = 5,
  ) {
    return this.recommendationService.getRecommendations(tenantId, studentId, limit);
  }

  @Get('student/:studentId/personalized')
  async getPersonalized(
    @Headers('x-tenant-id') tenantId: string,
    @Param('studentId') studentId: string,
  ) {
    return this.recommendationService.getPersonalizedRecommendations(tenantId, studentId);
  }

  @Get('courses/:courseId/similar')
  async getSimilarCourses(
    @Headers('x-tenant-id') tenantId: string,
    @Param('courseId') courseId: string,
    @Query('limit') limit: number = 5,
  ) {
    return this.recommendationService.getSimilarCourses(tenantId, courseId, limit);
  }

  @Post('courses/:courseId/rate')
  async rateCourse(
    @Headers('x-tenant-id') tenantId: string,
    @Headers('x-user-id') studentId: string,
    @Param('courseId') courseId: string,
    @Body() body: { rating: number },
  ) {
    return this.recommendationService.rateCourse(tenantId, studentId, courseId, body.rating);
  }

  @Get('trending')
  async getTrending(
    @Headers('x-tenant-id') tenantId: string,
    @Query('limit') limit: number = 10,
  ) {
    return this.recommendationService.getTrendingCourses(tenantId, limit);
  }

  @Get('stats')
  async getStats(
    @Headers('x-tenant-id') tenantId: string,
  ) {
    return this.recommendationService.getRecommendationStats(tenantId);
  }
}
