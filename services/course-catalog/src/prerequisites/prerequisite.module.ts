import { Module } from '@nestjs/common';
import { PrerequisiteService } from './services/prerequisite.service';
import { PrerequisiteController } from './controllers/prerequisite.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [PrerequisiteService],
  controllers: [PrerequisiteController],
  exports: [PrerequisiteService],
})
export class PrerequisiteModule {}
