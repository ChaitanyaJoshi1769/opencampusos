import { Injectable, BadRequestException, Logger, NotFoundException } from '@nestjs/common';
import { FinancialAidAward } from '@prisma/client';
import { AidRepository } from '../repositories/aid.repository';
import { StudentAccountRepository } from '../../student-accounts/repositories/student-account.repository';

export interface CreateAidDto {
  studentAccountId: string;
  awardType: 'scholarship' | 'grant' | 'loan' | 'work_study' | 'other';
  amount: number;
  academicYear?: string;
  source?: string;
  awardDate?: Date;
  disbursementDate?: Date;
  notes?: string;
}

@Injectable()
export class AidService {
  private readonly logger = new Logger(AidService.name);

  constructor(
    private readonly repository: AidRepository,
    private readonly accountRepository: StudentAccountRepository,
  ) {}

  async createAward(tenantId: string, dto: CreateAidDto): Promise<FinancialAidAward> {
    if (dto.amount <= 0) {
      throw new BadRequestException('Award amount must be positive');
    }

    const award = await this.repository.create(tenantId, dto.studentAccountId, {
      awardType: dto.awardType,
      amount: dto.amount,
      academicYear: dto.academicYear,
      source: dto.source,
      awardDate: dto.awardDate || new Date(),
      disbursementDate: dto.disbursementDate,
      notes: dto.notes,
    });

    this.logger.log(`✅ Created ${dto.awardType} award: ${award.id} for $${dto.amount}`);

    return award;
  }

  async getAward(tenantId: string, awardId: string): Promise<FinancialAidAward> {
    const award = await this.repository.findById(tenantId, awardId);

    if (!award) {
      throw new NotFoundException(`Award ${awardId} not found`);
    }

    return award;
  }

  async getStudentAwards(
    tenantId: string,
    studentAccountId: string,
  ): Promise<{ awards: FinancialAidAward[]; total: number }> {
    return this.repository.findByStudentAccount(tenantId, studentAccountId);
  }

  async getAwardsByType(tenantId: string, awardType: string): Promise<FinancialAidAward[]> {
    return this.repository.findByAwardType(tenantId, awardType);
  }

  async getAwardsByStatus(tenantId: string, status: string): Promise<FinancialAidAward[]> {
    return this.repository.findByStatus(tenantId, status);
  }

  async getTotalAwarded(tenantId: string): Promise<number> {
    return this.repository.getTotalAwarded(tenantId);
  }

  async getTotalAwardedByType(tenantId: string, awardType: string): Promise<number> {
    return this.repository.getTotalAwardedByType(tenantId, awardType);
  }

  async getStudentTotalAwarded(tenantId: string, studentAccountId: string): Promise<number> {
    return this.repository.getStudentTotalAwarded(tenantId, studentAccountId);
  }

  async updateAwardStatus(
    tenantId: string,
    awardId: string,
    status: 'active' | 'pending' | 'declined' | 'cancelled',
  ): Promise<FinancialAidAward> {
    const award = await this.getAward(tenantId, awardId);

    if (award.status === 'declined' || award.status === 'cancelled') {
      throw new BadRequestException(`Cannot update status of ${award.status} award`);
    }

    const updated = await this.repository.updateStatus(awardId, status);
    this.logger.log(`✅ Updated award status: ${awardId} → ${status}`);

    return updated;
  }

  async getAwaitingDisbursement(tenantId: string): Promise<FinancialAidAward[]> {
    return this.repository.findAwaitingDisbursement(tenantId);
  }

  async recordDisbursement(
    tenantId: string,
    awardId: string,
    disbursementDate: Date,
  ): Promise<FinancialAidAward> {
    const award = await this.getAward(tenantId, awardId);

    if (award.status !== 'active') {
      throw new BadRequestException('Only active awards can be disbursed');
    }

    const disbursed = await this.repository.recordDisbursement(awardId, disbursementDate);

    await this.accountRepository.updateBalance(tenantId, award.studentAccountId, -award.amount);

    this.logger.log(`✅ Recorded disbursement for award: ${awardId}`);

    return disbursed;
  }
}
