import { Module } from '@nestjs/common';
import { SyncService } from './services/sync.service';
import { SyncController } from './controllers/sync.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [SyncService],
  controllers: [SyncController],
})
export class SyncModule {}
