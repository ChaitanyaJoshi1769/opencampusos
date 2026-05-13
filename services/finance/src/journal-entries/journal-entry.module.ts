import { Module } from '@nestjs/common';
import { JournalEntryService } from './services/journal-entry.service';
import { JournalEntryController } from './controllers/journal-entry.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [JournalEntryService],
  controllers: [JournalEntryController],
  exports: [JournalEntryService],
})
export class JournalEntryModule {}
