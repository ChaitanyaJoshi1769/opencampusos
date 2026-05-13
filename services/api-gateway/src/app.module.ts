import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ApolloGatewayDriver, ApolloGatewayDriverConfig } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { AuthModule } from './auth/auth.module';
import { HealthModule } from './health/health.module';
import { MetricsModule } from './metrics/metrics.module';
import { ProxyModule } from './proxy/proxy.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    GraphQLModule.forRoot<ApolloGatewayDriverConfig>({
      driver: ApolloGatewayDriver,
      gateway: {
        buildService({ url }) {
          return new (require('@apollo/gateway').DataSourceBaseClass)({ url });
        },
        supergraphSdl: async () => {
          // Load supergraph SDL from managed federation or compose locally
          return {
            id: 'managed-federation',
            sdl: `
              # Placeholder supergraph
              # In production, this would be loaded from Apollo Studio or composed from subgraphs
            `,
          };
        },
      },
      // Disable introspection in production
      introspection: process.env.NODE_ENV !== 'production',
      // Playground in development only
      playground: process.env.NODE_ENV !== 'production',
      path: '/graphql',
    }),
    AuthModule,
    HealthModule,
    MetricsModule,
    ProxyModule,
  ],
})
export class AppModule {}
