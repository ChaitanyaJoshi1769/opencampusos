import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloFederationDriver, ApolloFederationDriverConfig } from '@nestjs/apollo';
import { PrismaModule } from './prisma/prisma.module';
import { HealthModule } from './health/health.module';
import { BudgetModule } from './budgets/budget.module';
import { ExpenseModule } from './expenses/expense.module';
import { AccountModule } from './accounts/account.module';
import { ReportModule } from './reports/report.module';
import { JournalEntryModule } from './journal-entries/journal-entry.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ['.env.local', '.env'] }),
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      autoSchemaFile: true,
    }),
    PrismaModule,
    HealthModule,
    BudgetModule,
    ExpenseModule,
    AccountModule,
    ReportModule,
    JournalEntryModule,
  ],
})
export class AppModule {}
