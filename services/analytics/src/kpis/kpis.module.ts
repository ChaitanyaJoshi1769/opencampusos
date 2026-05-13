import { Module } from '@nestjs/common';
import { KpiService } from './services/kpi.service';
import { KpiController } from './controllers/kpi.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [KpiService],
  controllers: [KpiController],
})
export class KpisModule {}
