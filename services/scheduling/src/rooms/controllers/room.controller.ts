import { Controller, Get, Post, Delete, Body, Param, Query, HttpCode } from '@nestjs/common';
import { RoomService, CreateRoomDto, BookRoomDto } from '../services/room.service';

@Controller('v1/rooms')
export class RoomController {
  constructor(private readonly service: RoomService) {}

  @Post()
  @HttpCode(201)
  async createRoom(@Body() dto: CreateRoomDto): Promise<{ status: string; data: any }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const room = await this.service.createRoom(tenantId, dto);

    return { status: 'success', data: room };
  }

  @Get(':id')
  @HttpCode(200)
  async getRoom(@Param('id') id: string): Promise<{ status: string; data: any }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const room = await this.service.getRoom(tenantId, id);

    return { status: 'success', data: room };
  }

  @Get()
  @HttpCode(200)
  async listRooms(@Query('building') building?: string, @Query('type') roomType?: string): Promise<{ status: string; data: any[] }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const rooms = await this.service.listRooms(tenantId, building, roomType);

    return { status: 'success', data: rooms };
  }

  @Post('bookings')
  @HttpCode(201)
  async bookRoom(@Body() dto: BookRoomDto): Promise<{ status: string; data: any }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const booking = await this.service.bookRoom(tenantId, dto);

    return { status: 'success', data: booking };
  }

  @Get('bookings/:id')
  @HttpCode(200)
  async getBooking(@Param('id') id: string): Promise<{ status: string; data: any }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const booking = await this.service.getBooking(tenantId, id);

    return { status: 'success', data: booking };
  }

  @Get('bookings')
  @HttpCode(200)
  async listBookings(
    @Query('roomId') roomId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<{ status: string; data: any[] }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const bookings = await this.service.listBookings(
      tenantId,
      roomId,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
    );

    return { status: 'success', data: bookings };
  }

  @Get(':id/availability')
  @HttpCode(200)
  async checkAvailability(
    @Param('id') roomId: string,
    @Query('startTime') startTime: string,
    @Query('endTime') endTime: string,
  ): Promise<{ status: string; data: any }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const result = await this.service.checkAvailability(
      tenantId,
      roomId,
      new Date(startTime),
      new Date(endTime),
    );

    return { status: 'success', data: result };
  }

  @Delete('bookings/:id')
  @HttpCode(200)
  async cancelBooking(@Param('id') id: string): Promise<{ status: string; message: string }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    await this.service.cancelBooking(tenantId, id);

    return { status: 'success', message: 'Booking cancelled successfully' };
  }

  @Get(':id/utilization')
  @HttpCode(200)
  async getRoomUtilization(
    @Param('id') roomId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<{ status: string; data: any }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const utilization = await this.service.getRoomUtilization(
      tenantId,
      roomId,
      new Date(startDate),
      new Date(endDate),
    );

    return { status: 'success', data: utilization };
  }

  @Get('find-available')
  @HttpCode(200)
  async findAvailableRooms(
    @Query('capacity') capacity: number,
    @Query('startTime') startTime: string,
    @Query('endTime') endTime: string,
    @Query('features') features?: string,
  ): Promise<{ status: string; data: any[] }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const featureList = features ? features.split(',') : undefined;
    const rooms = await this.service.findAvailableRooms(
      tenantId,
      capacity,
      new Date(startTime),
      new Date(endTime),
      featureList,
    );

    return { status: 'success', data: rooms };
  }
}
