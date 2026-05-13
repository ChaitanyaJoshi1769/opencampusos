import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class EquipmentService {
  constructor(private prisma: PrismaService) {}

  async addEquipment(tenantId: string, roomId: string, equipmentType: string, quantity = 1) {
    return this.prisma.equipment.create({
      data: { tenantId, roomId, type: equipmentType, quantity },
    });
  }

  async getRoomEquipment(tenantId: string, roomId: string) {
    return this.prisma.equipment.findMany({
      where: { tenantId, roomId },
    });
  }

  async updateEquipment(tenantId: string, equipmentId: string, quantity: number) {
    return this.prisma.equipment.update({
      where: { id: equipmentId },
      data: { quantity },
    });
  }

  async removeEquipment(tenantId: string, equipmentId: string) {
    return this.prisma.equipment.delete({
      where: { id: equipmentId },
    });
  }

  async findRoomsByEquipment(tenantId: string, equipmentType: string) {
    const equipment = await this.prisma.equipment.findMany({
      where: { tenantId, type: equipmentType },
      include: { room: true },
    });

    return equipment.map(e => e.room);
  }

  async getEquipmentInventory(tenantId: string) {
    const equipment = await this.prisma.equipment.findMany({
      where: { tenantId },
      include: { room: true },
    });

    const inventory = {};
    equipment.forEach(e => {
      if (!inventory[e.type]) {
        inventory[e.type] = { total: 0, rooms: [] };
      }
      inventory[e.type].total += e.quantity;
      inventory[e.type].rooms.push({
        roomId: e.roomId,
        roomNumber: e.room.roomNumber,
        quantity: e.quantity,
      });
    });

    return inventory;
  }

  async getAvailableEquipment(tenantId: string, equipmentType: string, minQuantity = 1) {
    const equipment = await this.prisma.equipment.findMany({
      where: {
        tenantId,
        type: equipmentType,
        quantity: { gte: minQuantity },
      },
      include: { room: true },
    });

    return equipment.map(e => ({
      room: e.room,
      quantity: e.quantity,
    }));
  }
}
