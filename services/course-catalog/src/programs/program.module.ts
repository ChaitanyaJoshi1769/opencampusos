import { Module } from '@nestjs/common';
import { ProgramService } from './services/program.service';
import { ProgramController } from './controllers/program.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [ProgramService],
  controllers: [ProgramController],
  exports: [ProgramService],
})
export class ProgramModule {}
