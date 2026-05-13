import { Module } from '@nestjs/common';
import { InterventionService } from './services/intervention.service';
import { InterventionController } from './controllers/intervention.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [InterventionService],
  controllers: [InterventionController],
})
export class InterventionsModule {}
