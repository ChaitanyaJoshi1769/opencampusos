import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import axios from 'axios';

@Injectable()
export class GatewayService {
  private logger = new Logger(GatewayService.name);

  constructor(private prisma: PrismaService) {}

  async aggregateUserData(tenantId: string, userId: string) {
    this.logger.log(`Aggregating data for user ${userId}`);

    const userData = {
      profile: await this.fetchUserProfile(userId),
      courses: await this.fetchUserCourses(userId),
      grades: await this.fetchUserGrades(userId),
      notifications: await this.fetchUserNotifications(userId),
      schedule: await this.fetchUserSchedule(userId),
    };

    return userData;
  }

  async getDashboard(tenantId: string, userId: string) {
    const userData = await this.aggregateUserData(tenantId, userId);

    return {
      user: userData.profile,
      enrolledCourses: userData.courses.slice(0, 5),
      recentGrades: userData.grades.slice(0, 5),
      upcomingEvents: userData.schedule.slice(0, 5),
      notifications: userData.notifications.slice(0, 10),
    };
  }

  async searchAcrossServices(tenantId: string, query: string) {
    this.logger.log(`Searching for: ${query}`);

    try {
      const results = await axios.get('http://localhost:3018/search', {
        params: { q: query },
        headers: { 'x-tenant-id': tenantId },
      });

      return results.data;
    } catch (error) {
      this.logger.error(`Search error: ${error.message}`);
      return { results: [] };
    }
  }

  async getRecommendations(tenantId: string, userId: string) {
    try {
      const results = await axios.get(`http://localhost:3021/recommendations/student/${userId}`, {
        headers: { 'x-tenant-id': tenantId },
      });

      return results.data;
    } catch (error) {
      this.logger.error(`Recommendations error: ${error.message}`);
      return { recommendations: [] };
    }
  }

  private async fetchUserProfile(userId: string) {
    return { id: userId, name: 'User Name', email: 'user@example.com' };
  }

  private async fetchUserCourses(userId: string) {
    return [
      { id: 'c1', name: 'Course 1', status: 'enrolled' },
      { id: 'c2', name: 'Course 2', status: 'enrolled' },
    ];
  }

  private async fetchUserGrades(userId: string) {
    return [
      { courseId: 'c1', grade: 'A', date: new Date() },
      { courseId: 'c2', grade: 'B+', date: new Date() },
    ];
  }

  private async fetchUserNotifications(userId: string) {
    return [
      { id: 'n1', message: 'New assignment posted', timestamp: new Date() },
      { id: 'n2', message: 'Grade posted', timestamp: new Date() },
    ];
  }

  private async fetchUserSchedule(userId: string) {
    return [
      { id: 's1', title: 'Class', start: new Date(), end: new Date() },
      { id: 's2', title: 'Office Hours', start: new Date(), end: new Date() },
    ];
  }
}
