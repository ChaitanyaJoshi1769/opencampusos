import { Module } from '@nestjs/common';
import { ApplicantRepository } from './repositories/applicant.repository';
import { ApplicantService } from './services/applicant.service';
import { ApplicantController } from './controllers/applicant.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [ApplicantRepository, ApplicantService],
  controllers: [ApplicantController],
  exports: [ApplicantService],
})
export class ApplicantsModule {}
