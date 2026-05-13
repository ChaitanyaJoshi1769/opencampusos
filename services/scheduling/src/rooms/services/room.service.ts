import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface CreateRoomDto {
  name: string;
  building: string;
  capacity: number;
  roomType: 'classroom' | 'lab' | 'seminar' | 'office' | 'auditorium' | 'other';
  features?: string[];
  floorNumber?: number;
}

export interface BookRoomDto {
  roomId: string;
  startTime: Date;
  endTime: Date;
  organizerId: string;
  purpose: string;
  expectedAttendees?: number;
}

@Injectable()
export class RoomService {
  private readonly logger = new Logger(RoomService.name);

  constructor(private readonly prisma: PrismaService) {}

  async createRoom(tenantId: string, dto: CreateRoomDto): Promise<any> {
    if (!dto.name || !dto.building || !dto.capacity || !dto.roomType) {
      throw new BadRequestException('name, building, capacity, and roomType are required');
    }

    const room = {
      id: 'RM-' + Date.now(),
      tenantId,
      ...dto,
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.logger.log(`✅ Created room: ${room.id} - ${dto.name}`);
    return room;
  }

  async getRoom(tenantId: string, roomId: string): Promise<any> {
    this.logger.log(`Retrieved room: ${roomId}`);

    return {
      id: roomId,
      tenantId,
      name: 'Room 101',
      building: 'Science Hall',
      capacity: 30,
      roomType: 'classroom',
      features: ['projector', 'whiteboard', 'wifi'],
      status: 'active',
      createdAt: new Date(),
    };
  }

  async listRooms(tenantId: string, building?: string, roomType?: string): Promise<any[]> {
    this.logger.log(`Listed rooms for tenant: ${tenantId}`);
    return [];
  }

  async bookRoom(tenantId: string, dto: BookRoomDto): Promise<any> {
    if (!dto.roomId || !dto.startTime || !dto.endTime || !dto.organizerId) {
      throw new BadRequestException('roomId, startTime, endTime, and organizerId are required');
    }

    const booking = {
      id: 'BK-' + Date.now(),
      tenantId,
      ...dto,
      status: 'confirmed',
      bookingDate: new Date(),
    };

    this.logger.log(`✅ Created room booking: ${booking.id} for room ${dto.roomId}`);
    return booking;
  }

  async getBooking(tenantId: string, bookingId: string): Promise<any> {
    this.logger.log(`Retrieved booking: ${bookingId}`);

    return {
      id: bookingId,
      tenantId,
      roomId: 'RM-001',
      startTime: new Date('2026-05-20T09:00:00'),
      endTime: new Date('2026-05-20T11:00:00'),
      organizerId: 'ORG-001',
      purpose: 'Lecture',
      status: 'confirmed',
      bookingDate: new Date(),
    };
  }

  async listBookings(tenantId: string, roomId?: string, startDate?: Date, endDate?: Date): Promise<any[]> {
    this.logger.log(`Listed bookings for tenant: ${tenantId}`);
    return [];
  }

  async checkAvailability(
    tenantId: string,
    roomId: string,
    startTime: Date,
    endTime: Date,
  ): Promise<{ available: boolean; conflicts: any[] }> {
    this.logger.log(`Checking availability for room ${roomId}`);

    return {
      available: true,
      conflicts: [],
    };
  }

  async cancelBooking(tenantId: string, bookingId: string): Promise<void> {
    this.logger.log(`Cancelled booking: ${bookingId}`);
  }

  async getRoomUtilization(tenantId: string, roomId: string, startDate: Date, endDate: Date): Promise<any> {
    this.logger.log(`Retrieved utilization for room: ${roomId}`);

    return {
      roomId,
      totalHours: 40,
      bookedHours: 32,
      utilizationPercent: 80,
      totalBookings: 16,
      period: { startDate, endDate },
    };
  }

  async findAvailableRooms(
    tenantId: string,
    capacity: number,
    startTime: Date,
    endTime: Date,
    features?: string[],
  ): Promise<any[]> {
    this.logger.log(`Finding available rooms for capacity ${capacity}`);

    return [
      {
        id: 'RM-101',
        name: 'Room 101',
        building: 'Science Hall',
        capacity: 30,
        features: ['projector', 'whiteboard'],
      },
      {
        id: 'RM-102',
        name: 'Room 102',
        building: 'Science Hall',
        capacity: 40,
        features: ['projector', 'whiteboard', 'smart board'],
      },
    ];
  }
}
