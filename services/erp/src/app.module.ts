import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { PrismaModule } from './prisma/prisma.module';
import { GeneralLedgerModule } from './general-ledger/general-ledger.module';
import { BudgetModule } from './budget/budget.module';
import { FinancialReportingModule } from './financial-reporting/financial-reporting.module';
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
    GeneralLedgerModule,
    BudgetModule,
    FinancialReportingModule,
  ],
})
export class AppModule {}
