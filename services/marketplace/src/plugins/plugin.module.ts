import { Module } from '@nestjs/common';
import { PluginService } from './services/plugin.service';
import { PluginController } from './controllers/plugin.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [PluginService],
  controllers: [PluginController],
  exports: [PluginService],
})
export class PluginModule {}
