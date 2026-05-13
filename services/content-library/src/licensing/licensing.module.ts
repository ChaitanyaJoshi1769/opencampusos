import { Module } from '@nestjs/common';
import { LicenseService } from './services/license.service';
import { LicenseController } from './controllers/license.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [LicenseService],
  controllers: [LicenseController],
})
export class LicensingModule {}
