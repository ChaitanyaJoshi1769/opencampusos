import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ReservationService {
  constructor(private prisma: PrismaService) {}

  async createReservation(tenantId: string, data: any) {
    return this.prisma.reservation.create({
      data: { ...data, tenantId, status: 'pending' },
      include: { room: true },
    });
  }

  async getReservation(tenantId: string, reservationId: string) {
    return this.prisma.reservation.findFirst({
      where: { id: reservationId, tenantId },
      include: { room: true },
    });
  }

  async listReservations(tenantId: string, filters?: any) {
    return this.prisma.reservation.findMany({
      where: {
        tenantId,
        ...(filters?.roomId && { roomId: filters.roomId }),
        ...(filters?.userId && { userId: filters.userId }),
        ...(filters?.status && { status: filters.status }),
        ...(filters?.from && { startTime: { gte: new Date(filters.from) } }),
        ...(filters?.to && { endTime: { lte: new Date(filters.to) } }),
      },
      include: { room: true },
      orderBy: { startTime: 'asc' },
      skip: filters?.skip || 0,
      take: filters?.take || 20,
    });
  }

  async updateReservation(tenantId: string, reservationId: string, data: any) {
    return this.prisma.reservation.update({
      where: { id: reservationId },
      data,
      include: { room: true },
    });
  }

  async confirmReservation(tenantId: string, reservationId: string) {
    return this.prisma.reservation.update({
      where: { id: reservationId },
      data: { status: 'confirmed', confirmedAt: new Date() },
    });
  }

  async cancelReservation(tenantId: string, reservationId: string, reason?: string) {
    return this.prisma.reservation.update({
      where: { id: reservationId },
      data: { status: 'cancelled', cancellationReason: reason },
    });
  }

  async getUserReservations(tenantId: string, userId: string) {
    return this.prisma.reservation.findMany({
      where: { tenantId, userId, status: 'confirmed' },
      include: { room: true },
      orderBy: { startTime: 'asc' },
    });
  }

  async getRoomReservations(tenantId: string, roomId: string, startDate: Date, endDate: Date) {
    return this.prisma.reservation.findMany({
      where: {
        tenantId,
        roomId,
        startTime: { gte: startDate },
        endTime: { lte: endDate },
        status: 'confirmed',
      },
      orderBy: { startTime: 'asc' },
    });
  }

  async checkConflict(tenantId: string, roomId: string, startTime: Date, endTime: Date) {
    const conflict = await this.prisma.reservation.findFirst({
      where: {
        tenantId,
        roomId,
        status: 'confirmed',
        startTime: { lt: endTime },
        endTime: { gt: startTime },
      },
    });
    return !!conflict;
  }

  async getReservationStats(tenantId: string) {
    const total = await this.prisma.reservation.count({ where: { tenantId } });
    const confirmed = await this.prisma.reservation.count({
      where: { tenantId, status: 'confirmed' },
    });
    const cancelled = await this.prisma.reservation.count({
      where: { tenantId, status: 'cancelled' },
    });
    const pending = await this.prisma.reservation.count({
      where: { tenantId, status: 'pending' },
    });

    return { total, confirmed, cancelled, pending };
  }
}
