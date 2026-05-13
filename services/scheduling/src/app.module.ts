import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { HealthModule } from './health/health.module';
import { CalendarModule } from './calendar/calendar.module';
import { RoomModule } from './rooms/room.module';
import { ScheduleModule } from './schedules/schedule.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ['.env.local', '.env'] }),
    PrismaModule,
    HealthModule,
    CalendarModule,
    RoomModule,
    ScheduleModule,
  ],
})
export class AppModule {}
