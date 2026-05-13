import { Module } from '@nestjs/common';
import { ExportService } from './services/export.service';
import { ExportController } from './controllers/export.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [ExportService],
  controllers: [ExportController],
  exports: [ExportService],
})
export class ExportModule {}
