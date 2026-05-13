import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class RoomService {
  constructor(private prisma: PrismaService) {}

  async createRoom(tenantId: string, data: any) {
    return this.prisma.room.create({
      data: { ...data, tenantId },
    });
  }

  async getRoom(tenantId: string, roomId: string) {
    return this.prisma.room.findFirst({
      where: { id: roomId, tenantId },
      include: { equipment: true, reservations: { take: 5 } },
    });
  }

  async listRooms(tenantId: string, filters?: any) {
    return this.prisma.room.findMany({
      where: {
        tenantId,
        ...(filters?.building && { building: filters.building }),
        ...(filters?.capacity && { capacity: { gte: filters.capacity } }),
        ...(filters?.features && { features: { hasSome: filters.features } }),
      },
      include: { _count: { select: { reservations: true } } },
      skip: filters?.skip || 0,
      take: filters?.take || 20,
    });
  }

  async updateRoom(tenantId: string, roomId: string, data: any) {
    return this.prisma.room.update({
      where: { id: roomId },
      data,
    });
  }

  async deleteRoom(tenantId: string, roomId: string) {
    return this.prisma.room.delete({
      where: { id: roomId },
    });
  }

  async getRoomsByBuilding(tenantId: string, building: string) {
    return this.prisma.room.findMany({
      where: { tenantId, building },
      orderBy: { roomNumber: 'asc' },
    });
  }

  async getRoomsByCapacity(tenantId: string, minCapacity: number, maxCapacity?: number) {
    return this.prisma.room.findMany({
      where: {
        tenantId,
        capacity: {
          gte: minCapacity,
          ...(maxCapacity && { lte: maxCapacity }),
        },
      },
      orderBy: { capacity: 'asc' },
    });
  }

  async findAvailableRooms(tenantId: string, startTime: Date, endTime: Date, minCapacity?: number) {
    const allRooms = await this.prisma.room.findMany({
      where: {
        tenantId,
        ...(minCapacity && { capacity: { gte: minCapacity } }),
      },
    });

    const conflicts = await this.prisma.reservation.findMany({
      where: {
        tenantId,
        startTime: { lt: endTime },
        endTime: { gt: startTime },
        status: 'confirmed',
      },
      select: { roomId: true },
    });

    const conflictingRoomIds = new Set(conflicts.map(c => c.roomId));
    return allRooms.filter(room => !conflictingRoomIds.has(room.id));
  }

  async getRoomStats(tenantId: string) {
    const total = await this.prisma.room.count({ where: { tenantId } });
    const buildings = await this.prisma.room.groupBy({
      by: ['building'],
      where: { tenantId },
      _count: { id: true },
    });
    const totalCapacity = await this.prisma.room.aggregate({
      where: { tenantId },
      _sum: { capacity: true },
    });

    return {
      totalRooms: total,
      totalCapacity: totalCapacity._sum.capacity || 0,
      buildings: buildings.map(b => ({
        building: b.building,
        roomCount: b._count.id,
      })),
    };
  }
}
