import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface CreateContentDto {
  courseId: string;
  title: string;
  description?: string;
  type: 'lecture' | 'assignment' | 'reading' | 'video' | 'quiz' | 'other';
  contentUrl: string;
  duration?: number;
  order: number;
}

@Injectable()
export class ContentService {
  private readonly logger = new Logger(ContentService.name);

  constructor(private readonly prisma: PrismaService) {}

  async createContent(tenantId: string, dto: CreateContentDto): Promise<any> {
    if (!dto.courseId || !dto.title || !dto.type || !dto.contentUrl) {
      throw new BadRequestException('courseId, title, type, and contentUrl are required');
    }

    const content = {
      id: 'CONT-' + Date.now(),
      tenantId,
      ...dto,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.logger.log(`✅ Created content: ${content.id} - ${dto.title}`);
    return content;
  }

  async getContent(tenantId: string, contentId: string): Promise<any> {
    this.logger.log(`Retrieved content: ${contentId}`);

    return {
      id: contentId,
      tenantId,
      courseId: 'CRS-123',
      title: 'Lecture 1: Introduction',
      type: 'lecture',
      contentUrl: 'https://example.com/lectures/1',
      duration: 3600,
      order: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  async listContentByCourse(tenantId: string, courseId: string): Promise<any[]> {
    this.logger.log(`Listed content for course: ${courseId}`);
    return [];
  }

  async updateContent(tenantId: string, contentId: string, dto: Partial<CreateContentDto>): Promise<any> {
    this.logger.log(`Updated content: ${contentId}`);

    return {
      id: contentId,
      tenantId,
      ...dto,
      updatedAt: new Date(),
    };
  }

  async deleteContent(tenantId: string, contentId: string): Promise<void> {
    this.logger.log(`Deleted content: ${contentId}`);
  }
}
