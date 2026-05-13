import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { HealthModule } from './health/health.module';
import { ResourcesModule } from './resources/resources.module';
import { MaterialsModule } from './materials/materials.module';
import { LicensingModule } from './licensing/licensing.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ['.env.local', '.env'] }),
    PrismaModule,
    HealthModule,
    ResourcesModule,
    MaterialsModule,
    LicensingModule,
  ],
})
export class AppModule {}
