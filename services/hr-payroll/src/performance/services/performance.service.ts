import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PerformanceService {
  constructor(private prisma: PrismaService) {}

  async createReview(tenantId: string, data: any) {
    return this.prisma.performanceReview.create({
      data: {
        tenantId,
        ...data,
        rating: parseFloat(data.rating),
        reviewDate: new Date(data.reviewDate),
        status: 'draft',
      },
    });
  }

  async getReview(tenantId: string, reviewId: string) {
    return this.prisma.performanceReview.findFirst({
      where: { id: reviewId, tenantId },
    });
  }

  async listReviews(tenantId: string, filters?: any) {
    return this.prisma.performanceReview.findMany({
      where: {
        tenantId,
        ...(filters?.employeeId && { employeeId: filters.employeeId }),
        ...(filters?.status && { status: filters.status }),
      },
      orderBy: { reviewDate: 'desc' },
    });
  }

  async submitReview(tenantId: string, reviewId: string) {
    return this.prisma.performanceReview.update({
      where: { id: reviewId },
      data: { status: 'submitted' },
    });
  }

  async approveReview(tenantId: string, reviewId: string, approverName: string) {
    return this.prisma.performanceReview.update({
      where: { id: reviewId },
      data: { status: 'approved', approvedBy: approverName, approvedAt: new Date() },
    });
  }

  async getEmployeeReviewHistory(tenantId: string, employeeId: string) {
    return this.prisma.performanceReview.findMany({
      where: { tenantId, employeeId, status: 'approved' },
      orderBy: { reviewDate: 'desc' },
      take: 5,
    });
  }

  async getAverageRating(tenantId: string, employeeId: string) {
    const reviews = await this.prisma.performanceReview.findMany({
      where: { tenantId, employeeId, status: 'approved' },
    });

    const average = reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

    return {
      employeeId,
      averageRating: Math.round(average * 100) / 100,
      reviewCount: reviews.length,
    };
  }

  async getPerformanceStats(tenantId: string) {
    const total = await this.prisma.performanceReview.count({ where: { tenantId } });
    const approved = await this.prisma.performanceReview.count({
      where: { tenantId, status: 'approved' },
    });
    const pending = await this.prisma.performanceReview.count({
      where: { tenantId, status: 'draft' },
    });

    return { total, approved, pending };
  }
}
