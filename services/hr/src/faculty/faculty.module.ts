import { Module } from '@nestjs/common';
import { FacultyRepository } from './repositories/faculty.repository';
import { FacultyService } from './services/faculty.service';
import { FacultyController } from './controllers/faculty.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [FacultyRepository, FacultyService],
  controllers: [FacultyController],
  exports: [FacultyService],
})
export class FacultyModule {}
