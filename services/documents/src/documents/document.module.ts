import { Module } from '@nestjs/common';
import { DocumentService } from './services/document.service';
import { DocumentController } from './controllers/document.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [DocumentService],
  controllers: [DocumentController],
  exports: [DocumentService],
})
export class DocumentModule {}
