import { Controller, Get, Post, Put, Delete, Body, Param, Query, Headers } from '@nestjs/common';
import { EquipmentService } from '../services/equipment.service';

@Controller('equipment')
export class EquipmentController {
  constructor(private equipmentService: EquipmentService) {}

  @Post()
  async addEquipment(
    @Body() body: { roomId: string; type: string; quantity?: number },
    @Headers('x-tenant-id') tenantId: string,
  ) {
    return this.equipmentService.addEquipment(tenantId, body.roomId, body.type, body.quantity);
  }

  @Get('inventory')
  async getInventory(@Headers('x-tenant-id') tenantId: string) {
    return this.equipmentService.getEquipmentInventory(tenantId);
  }

  @Get('available')
  async getAvailableEquipment(
    @Query('type') equipmentType: string,
    @Query('minQuantity') minQuantity?: string,
    @Headers('x-tenant-id') tenantId?: string,
  ) {
    return this.equipmentService.getAvailableEquipment(
      tenantId,
      equipmentType,
      minQuantity ? parseInt(minQuantity) : 1,
    );
  }

  @Get('type/:type/rooms')
  async getRoomsByEquipment(
    @Param('type') equipmentType: string,
    @Headers('x-tenant-id') tenantId: string,
  ) {
    return this.equipmentService.findRoomsByEquipment(tenantId, equipmentType);
  }

  @Get('room/:roomId')
  async getRoomEquipment(
    @Param('roomId') roomId: string,
    @Headers('x-tenant-id') tenantId: string,
  ) {
    return this.equipmentService.getRoomEquipment(tenantId, roomId);
  }

  @Put(':id')
  async updateEquipment(
    @Param('id') equipmentId: string,
    @Body() body: { quantity: number },
    @Headers('x-tenant-id') tenantId: string,
  ) {
    return this.equipmentService.updateEquipment(tenantId, equipmentId, body.quantity);
  }

  @Delete(':id')
  async removeEquipment(
    @Param('id') equipmentId: string,
    @Headers('x-tenant-id') tenantId: string,
  ) {
    return this.equipmentService.removeEquipment(tenantId, equipmentId);
  }
}
