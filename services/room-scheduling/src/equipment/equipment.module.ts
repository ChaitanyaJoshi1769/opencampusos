import { Module } from '@nestjs/common';
import { EquipmentService } from './services/equipment.service';
import { EquipmentController } from './controllers/equipment.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [EquipmentService],
  controllers: [EquipmentController],
  exports: [EquipmentService],
})
export class EquipmentModule {}
