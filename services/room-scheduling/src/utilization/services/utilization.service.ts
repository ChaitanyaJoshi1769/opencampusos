import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class UtilizationService {
  constructor(private prisma: PrismaService) {}

  async recordUtilization(tenantId: string, roomId: string, occupancy: number) {
    return this.prisma.roomUtilization.create({
      data: { tenantId, roomId, occupancy, recordedAt: new Date() },
    });
  }

  async getRoomUtilization(tenantId: string, roomId: string, days = 7) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    return this.prisma.roomUtilization.findMany({
      where: {
        tenantId,
        roomId,
        recordedAt: { gte: startDate },
      },
      orderBy: { recordedAt: 'asc' },
    });
  }

  async getAverageUtilization(tenantId: string, roomId: string, days = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const result = await this.prisma.roomUtilization.aggregate({
      where: {
        tenantId,
        roomId,
        recordedAt: { gte: startDate },
      },
      _avg: { occupancy: true },
      _max: { occupancy: true },
    });

    return {
      averageOccupancy: result._avg.occupancy || 0,
      maxOccupancy: result._max.occupancy || 0,
    };
  }

  async getBuildingUtilization(tenantId: string, building: string) {
    const rooms = await this.prisma.room.findMany({
      where: { tenantId, building },
      select: { id: true },
    });

    const utilization = await Promise.all(
      rooms.map(async (room) => ({
        roomId: room.id,
        avgUtilization: await this.getAverageUtilization(tenantId, room.id),
      })),
    );

    return utilization;
  }

  async getUnderutilizedRooms(tenantId: string, threshold = 30) {
    const rooms = await this.prisma.room.findMany({
      where: { tenantId },
      select: { id: true, roomNumber: true, building: true, capacity: true },
    });

    const underutilized = [];
    for (const room of rooms) {
      const util = await this.getAverageUtilization(tenantId, room.id);
      if (util.averageOccupancy < threshold) {
        underutilized.push({
          ...room,
          utilizationRate: util.averageOccupancy,
        });
      }
    }

    return underutilized;
  }

  async getUtilizationTrend(tenantId: string, roomId: string, days = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const data = await this.prisma.roomUtilization.findMany({
      where: {
        tenantId,
        roomId,
        recordedAt: { gte: startDate },
      },
      orderBy: { recordedAt: 'asc' },
    });

    const trend = data.map(d => ({
      date: d.recordedAt,
      occupancy: d.occupancy,
    }));

    return trend;
  }

  async generateUtilizationReport(tenantId: string, startDate: Date, endDate: Date) {
    const rooms = await this.prisma.room.findMany({
      where: { tenantId },
    });

    const report = await Promise.all(
      rooms.map(async (room) => {
        const utilData = await this.prisma.roomUtilization.findMany({
          where: {
            tenantId,
            roomId: room.id,
            recordedAt: { gte: startDate, lte: endDate },
          },
        });

        const avgOccupancy = utilData.length > 0
          ? utilData.reduce((sum, u) => sum + u.occupancy, 0) / utilData.length
          : 0;

        return {
          roomId: room.id,
          roomNumber: room.roomNumber,
          building: room.building,
          capacity: room.capacity,
          averageOccupancy: avgOccupancy,
          utilizationRate: (avgOccupancy / room.capacity) * 100,
          dataPoints: utilData.length,
        };
      }),
    );

    return {
      startDate,
      endDate,
      totalRooms: rooms.length,
      rooms: report,
      averageUtilization: report.reduce((sum, r) => sum + r.utilizationRate, 0) / report.length,
    };
  }
}
