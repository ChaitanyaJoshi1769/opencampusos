import { Module } from '@nestjs/common';
import { CostService } from './services/cost.service';
import { CostController } from './controllers/cost.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [CostService],
  controllers: [CostController],
})
export class CostsModule {}
