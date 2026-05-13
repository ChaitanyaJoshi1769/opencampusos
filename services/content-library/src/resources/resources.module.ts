import { Module } from '@nestjs/common';
import { ResourceService } from './services/resource.service';
import { ResourceController } from './controllers/resource.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [ResourceService],
  controllers: [ResourceController],
})
export class ResourcesModule {}
