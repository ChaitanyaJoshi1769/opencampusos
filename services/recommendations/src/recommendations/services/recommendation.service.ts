import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class RecommendationService {
  private logger = new Logger(RecommendationService.name);

  constructor(private prisma: PrismaService) {}

  async getRecommendations(tenantId: string, studentId: string, limit: number = 5) {
    this.logger.log(`Getting course recommendations for student ${studentId}`);

    const recommendation = await this.prisma.recommendation.create({
      data: {
        tenantId,
        studentId,
        type: 'course',
        algorithm: 'collaborative_filtering',
        requestedAt: new Date(),
      },
    });

    const recommendations = this.generateMockRecommendations(limit);

    await this.prisma.recommendation.update({
      where: { id: recommendation.id },
      data: {
        data: {
          courses: recommendations,
        },
        generatedAt: new Date(),
      },
    });

    return {
      studentId,
      recommendations,
      timestamp: new Date(),
    };
  }

  async getPersonalizedRecommendations(tenantId: string, studentId: string) {
    this.logger.log(`Getting personalized recommendations for ${studentId}`);

    const recs = await this.prisma.recommendation.findMany({
      where: {
        tenantId,
        studentId,
        type: 'course',
      },
      orderBy: { generatedAt: 'desc' },
      take: 1,
    });

    if (recs.length === 0) {
      return this.getRecommendations(tenantId, studentId);
    }

    return recs[0];
  }

  async getSimilarCourses(tenantId: string, courseId: string, limit: number = 5) {
    this.logger.log(`Getting similar courses for course ${courseId}`);

    return {
      courseId,
      similarCourses: this.generateMockRecommendations(limit),
    };
  }

  async rateCourse(tenantId: string, studentId: string, courseId: string, rating: number) {
    this.logger.log(`Rating course ${courseId} by student ${studentId}`);

    return this.prisma.courseRating.create({
      data: {
        tenantId,
        studentId,
        courseId,
        rating: Math.min(5, Math.max(1, rating)),
        ratedAt: new Date(),
      },
    });
  }

  async getTrendingCourses(tenantId: string, limit: number = 10) {
    this.logger.log(`Getting trending courses for tenant ${tenantId}`);

    return {
      courses: this.generateMockRecommendations(limit),
      period: 'last_30_days',
    };
  }

  async getRecommendationStats(tenantId: string) {
    const recommendations = await this.prisma.recommendation.findMany({
      where: { tenantId },
    });

    const ratings = await this.prisma.courseRating.findMany({
      where: { tenantId },
    });

    return {
      totalRecommendations: recommendations.length,
      totalRatings: ratings.length,
      averageRating: ratings.length > 0
        ? (ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(2)
        : 0,
    };
  }

  private generateMockRecommendations(count: number) {
    const courses = [
      { id: 'CS101', name: 'Intro to Computer Science', department: 'CS', score: 0.95 },
      { id: 'MATH201', name: 'Calculus II', department: 'MATH', score: 0.88 },
      { id: 'PHYS101', name: 'Physics I', department: 'PHYS', score: 0.85 },
      { id: 'ENG201', name: 'Literature & Writing', department: 'ENG', score: 0.82 },
      { id: 'CHEM101', name: 'General Chemistry', department: 'CHEM', score: 0.80 },
      { id: 'BIO201', name: 'Biology II', department: 'BIO', score: 0.78 },
      { id: 'HIST101', name: 'World History', department: 'HIST', score: 0.75 },
      { id: 'PSYCH101', name: 'Intro to Psychology', department: 'PSYCH', score: 0.72 },
    ];

    return courses.slice(0, count);
  }
}
