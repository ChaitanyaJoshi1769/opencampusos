import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { PrismaModule } from './prisma/prisma.module';
import { SearchModule } from './search/search.module';
import { QueryModule } from './query/query.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ['.env.local', '.env'] }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'schema.gql',
      introspection: true,
      playground: true,
    }),
    PrismaModule,
    HealthModule,
    SearchModule,
    QueryModule,
  ],
})
export class AppModule {}
