import { Module } from '@nestjs/common';
import { AlertService } from './services/alert.service';
import { AlertController } from './controllers/alert.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [AlertService],
  controllers: [AlertController],
})
export class AlertsModule {}
