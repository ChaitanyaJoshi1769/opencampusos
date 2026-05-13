import { Module } from '@nestjs/common';
import { IndexService } from './services/index.service';
import { IndexController } from './controllers/index.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [IndexService],
  controllers: [IndexController],
})
export class IndexesModule {}
