import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloFederationDriver, ApolloFederationDriverConfig } from '@nestjs/apollo';
import { PrismaModule } from './prisma/prisma.module';
import { HealthModule } from './health/health.module';
import { CourseModule } from './courses/course.module';
import { DepartmentModule } from './departments/department.module';
import { ProgramModule } from './programs/program.module';
import { PrerequisiteModule } from './prerequisites/prerequisite.module';
import { CatalogVersionModule } from './catalog-versions/catalog-version.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ['.env.local', '.env'] }),
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      autoSchemaFile: true,
    }),
    PrismaModule,
    HealthModule,
    CourseModule,
    DepartmentModule,
    ProgramModule,
    PrerequisiteModule,
    CatalogVersionModule,
  ],
})
export class AppModule {}
