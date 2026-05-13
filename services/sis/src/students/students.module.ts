import { Module } from '@nestjs/common';
import { StudentRepository } from './repositories/student.repository';
import { StudentService } from './services/student.service';
import { StudentController } from './controllers/student.controller';
import { StudentResolver } from './resolvers/student.resolver';
import { PrismaModule } from '../prisma/prisma.module';
import { EventsModule } from '../events/events.module';

@Module({
  imports: [PrismaModule, EventsModule],
  providers: [StudentRepository, StudentService, StudentResolver],
  controllers: [StudentController],
  exports: [StudentService],
})
export class StudentsModule {}
