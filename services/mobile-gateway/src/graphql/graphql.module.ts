import { Module } from '@nestjs/common';
import { GatewayService } from './services/gateway.service';
import { GatewayResolver } from './resolvers/gateway.resolver';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [GatewayService, GatewayResolver],
})
export class GraphQLGatewayModule {}
