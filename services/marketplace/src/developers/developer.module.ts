import { Module } from '@nestjs/common';
import { DeveloperService } from './services/developer.service';
import { DeveloperController } from './controllers/developer.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [DeveloperService],
  controllers: [DeveloperController],
  exports: [DeveloperService],
})
export class DeveloperModule {}
