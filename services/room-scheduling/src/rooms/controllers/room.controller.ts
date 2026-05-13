import { Controller, Get, Post, Put, Delete, Body, Param, Query, Headers } from '@nestjs/common';
import { RoomService } from '../services/room.service';

@Controller('rooms')
export class RoomController {
  constructor(private roomService: RoomService) {}

  @Post()
  async createRoom(@Body() data: any, @Headers('x-tenant-id') tenantId: string) {
    return this.roomService.createRoom(tenantId, data);
  }

  @Get()
  async listRooms(@Query() filters: any, @Headers('x-tenant-id') tenantId: string) {
    return this.roomService.listRooms(tenantId, filters);
  }

  @Get('stats')
  async getStats(@Headers('x-tenant-id') tenantId: string) {
    return this.roomService.getRoomStats(tenantId);
  }

  @Get('available')
  async getAvailableRooms(
    @Query('startTime') startTime: string,
    @Query('endTime') endTime: string,
    @Query('minCapacity') minCapacity?: string,
    @Headers('x-tenant-id') tenantId?: string,
  ) {
    return this.roomService.findAvailableRooms(
      tenantId,
      new Date(startTime),
      new Date(endTime),
      minCapacity ? parseInt(minCapacity) : undefined,
    );
  }

  @Get('building/:building')
  async getRoomsByBuilding(
    @Param('building') building: string,
    @Headers('x-tenant-id') tenantId: string,
  ) {
    return this.roomService.getRoomsByBuilding(tenantId, building);
  }

  @Get(':id')
  async getRoom(
    @Param('id') roomId: string,
    @Headers('x-tenant-id') tenantId: string,
  ) {
    return this.roomService.getRoom(tenantId, roomId);
  }

  @Put(':id')
  async updateRoom(
    @Param('id') roomId: string,
    @Body() data: any,
    @Headers('x-tenant-id') tenantId: string,
  ) {
    return this.roomService.updateRoom(tenantId, roomId, data);
  }

  @Delete(':id')
  async deleteRoom(
    @Param('id') roomId: string,
    @Headers('x-tenant-id') tenantId: string,
  ) {
    return this.roomService.deleteRoom(tenantId, roomId);
  }
}
