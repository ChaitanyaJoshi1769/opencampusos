import { Module } from '@nestjs/common';
import { AdvisingService } from './services/advising.service';
import { AdvisingController } from './controllers/advising.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [AdvisingService],
  controllers: [AdvisingController],
})
export class AdvisingModule {}
