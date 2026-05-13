import { Module } from '@nestjs/common';
import { ResponseService } from './services/response.service';
import { ResponseController } from './controllers/response.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [ResponseService],
  controllers: [ResponseController],
})
export class ResponsesModule {}
