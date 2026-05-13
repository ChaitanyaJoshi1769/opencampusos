import { Module } from '@nestjs/common';
import { MaterialService } from './services/material.service';
import { MaterialController } from './controllers/material.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [MaterialService],
  controllers: [MaterialController],
})
export class MaterialsModule {}
