import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  // Controllers, services, and resolvers will be added here
})
export class CoursesModule {}
