import { Module } from '@nestjs/common';
import { ReservationService } from './services/reservation.service';
import { ReservationController } from './controllers/reservation.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [ReservationService],
  controllers: [ReservationController],
  exports: [ReservationService],
})
export class ReservationModule {}
