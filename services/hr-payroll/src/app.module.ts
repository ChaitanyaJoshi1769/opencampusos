import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloFederationDriver, ApolloFederationDriverConfig } from '@nestjs/apollo';
import { PrismaModule } from './prisma/prisma.module';
import { HealthModule } from './health/health.module';
import { EmployeeModule } from './employees/employee.module';
import { PayrollModule } from './payroll/payroll.module';
import { BenefitModule } from './benefits/benefit.module';
import { LeaveModule } from './leaves/leave.module';
import { PerformanceModule } from './performance/performance.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ['.env.local', '.env'] }),
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      autoSchemaFile: true,
    }),
    PrismaModule,
    HealthModule,
    EmployeeModule,
    PayrollModule,
    BenefitModule,
    LeaveModule,
    PerformanceModule,
  ],
})
export class AppModule {}
