import { Module } from '@nestjs/common';
import { ConnectorService } from './services/connector.service';
import { ConnectorController } from './controllers/connector.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [ConnectorService],
  controllers: [ConnectorController],
})
export class ConnectorsModule {}
