import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloFederationDriver, ApolloFederationDriverConfig } from '@nestjs/apollo';
import { PrismaModule } from './prisma/prisma.module';
import { HealthModule } from './health/health.module';
import { RoomModule } from './rooms/room.module';
import { ReservationModule } from './reservations/reservation.module';
import { UtilizationModule } from './utilization/utilization.module';
import { ScheduleModule } from './schedule/schedule.module';
import { EquipmentModule } from './equipment/equipment.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ['.env.local', '.env'] }),
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      autoSchemaFile: true,
    }),
    PrismaModule,
    HealthModule,
    RoomModule,
    ReservationModule,
    UtilizationModule,
    ScheduleModule,
    EquipmentModule,
  ],
})
export class AppModule {}
