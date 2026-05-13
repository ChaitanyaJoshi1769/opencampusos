import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ScheduleService {
  constructor(private prisma: PrismaService) {}

  async publishSchedule(tenantId: string, academicTerm: string) {
    const reservations = await this.prisma.reservation.findMany({
      where: { tenantId, academicTerm, status: 'confirmed' },
    });

    return {
      academicTerm,
      publishedAt: new Date(),
      totalReservations: reservations.length,
      status: 'published',
    };
  }

  async getTermSchedule(tenantId: string, academicTerm: string) {
    const reservations = await this.prisma.reservation.findMany({
      where: { tenantId, academicTerm, status: 'confirmed' },
      include: { room: true },
      orderBy: { startTime: 'asc' },
    });

    return {
      academicTerm,
      totalReservations: reservations.length,
      reservations,
    };
  }

  async getWeeklySchedule(tenantId: string, startDate: Date) {
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 7);

    return this.prisma.reservation.findMany({
      where: {
        tenantId,
        startTime: { gte: startDate },
        endTime: { lte: endDate },
        status: 'confirmed',
      },
      include: { room: true },
      orderBy: { startTime: 'asc' },
    });
  }

  async getDaySchedule(tenantId: string, date: Date) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return this.prisma.reservation.findMany({
      where: {
        tenantId,
        startTime: { gte: startOfDay },
        endTime: { lte: endOfDay },
        status: 'confirmed',
      },
      include: { room: true },
      orderBy: { startTime: 'asc' },
    });
  }

  async getConflictingSchedules(tenantId: string) {
    const allReservations = await this.prisma.reservation.findMany({
      where: { tenantId, status: 'confirmed' },
      include: { room: true },
    });

    const conflicts = [];
    for (let i = 0; i < allReservations.length; i++) {
      for (let j = i + 1; j < allReservations.length; j++) {
        const res1 = allReservations[i];
        const res2 = allReservations[j];

        if (
          res1.roomId === res2.roomId &&
          res1.startTime < res2.endTime &&
          res1.endTime > res2.startTime
        ) {
          conflicts.push({ reservation1: res1.id, reservation2: res2.id });
        }
      }
    }

    return conflicts;
  }

  async exportSchedule(tenantId: string, academicTerm: string, format = 'json') {
    const schedule = await this.getTermSchedule(tenantId, academicTerm);

    if (format === 'csv') {
      const csv = this.convertToCSV(schedule.reservations);
      return { format: 'csv', data: csv };
    }

    return { format: 'json', data: schedule };
  }

  private convertToCSV(reservations: any[]): string {
    const headers = ['Room', 'StartTime', 'EndTime', 'Organizer', 'Status'];
    const rows = reservations.map(r => [
      r.room.roomNumber,
      r.startTime.toISOString(),
      r.endTime.toISOString(),
      r.organizer,
      r.status,
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
    ].join('\n');

    return csvContent;
  }

  async generateScheduleInsights(tenantId: string) {
    const currentYear = new Date().getFullYear();
    const startDate = new Date(currentYear, 0, 1);
    const endDate = new Date(currentYear, 11, 31);

    const reservations = await this.prisma.reservation.findMany({
      where: {
        tenantId,
        startTime: { gte: startDate },
        endTime: { lte: endDate },
        status: 'confirmed',
      },
      include: { room: true },
    });

    const peakHours = this.calculatePeakHours(reservations);
    const mostUsedRooms = this.getMostUsedRooms(reservations);

    return {
      totalReservations: reservations.length,
      peakHours,
      mostUsedRooms,
      averageReservationDuration: this.calculateAverageDuration(reservations),
    };
  }

  private calculatePeakHours(reservations: any[]): any {
    const hourCounts = {};
    reservations.forEach(r => {
      const hour = r.startTime.getHours();
      hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    });
    return Object.entries(hourCounts)
      .map(([hour, count]) => ({ hour: parseInt(hour), count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }

  private getMostUsedRooms(reservations: any[]): any {
    const roomCounts = {};
    reservations.forEach(r => {
      const key = r.room.roomNumber;
      roomCounts[key] = (roomCounts[key] || 0) + 1;
    });
    return Object.entries(roomCounts)
      .map(([room, count]) => ({ room, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }

  private calculateAverageDuration(reservations: any[]): number {
    if (reservations.length === 0) return 0;
    const totalMinutes = reservations.reduce((sum, r) => {
      return sum + (r.endTime.getTime() - r.startTime.getTime()) / (1000 * 60);
    }, 0);
    return Math.round(totalMinutes / reservations.length);
  }
}
