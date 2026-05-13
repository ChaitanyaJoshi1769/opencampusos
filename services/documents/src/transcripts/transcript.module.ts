import { Module } from '@nestjs/common';
import { TranscriptService } from './services/transcript.service';
import { TranscriptController } from './controllers/transcript.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [TranscriptService],
  controllers: [TranscriptController],
  exports: [TranscriptService],
})
export class TranscriptModule {}
