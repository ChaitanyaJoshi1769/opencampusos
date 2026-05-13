import { Module } from '@nestjs/common';
import { ApplicationRepository } from './repositories/application.repository';
import { ApplicationService } from './services/application.service';
import { ApplicationController } from './controllers/application.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [ApplicationRepository, ApplicationService],
  controllers: [ApplicationController],
  exports: [ApplicationService],
})
export class ApplicationsModule {}
