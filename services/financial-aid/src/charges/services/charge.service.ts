import { Injectable, BadRequestException, Logger, NotFoundException } from '@nestjs/common';
import { Charge } from '@prisma/client';
import { ChargeRepository } from '../repositories/charge.repository';
import { StudentAccountService } from '../../student-accounts/services/student-account.service';

export interface CreateChargeDto {
  studentAccountId: string;
  chargeType: 'tuition' | 'fees' | 'housing' | 'other';
  amount: number;
  chargeDate: Date;
  dueDate: Date;
  description?: string;
  termId?: string;
}

@Injectable()
export class ChargeService {
  private readonly logger = new Logger(ChargeService.name);

  constructor(
    private readonly repository: ChargeRepository,
    private readonly accountService: StudentAccountService,
  ) {}

  async createCharge(tenantId: string, dto: CreateChargeDto): Promise<Charge> {
    if (dto.amount <= 0) {
      throw new BadRequestException('Charge amount must be positive');
    }

    if (dto.dueDate < dto.chargeDate) {
      throw new BadRequestException('Due date must be after charge date');
    }

    const charge = await this.repository.create(tenantId, dto.studentAccountId, {
      chargeType: dto.chargeType,
      amount: dto.amount,
      chargeDate: dto.chargeDate,
      dueDate: dto.dueDate,
      description: dto.description,
      termId: dto.termId,
    });

    // Add to account balance
    await this.accountService.addChargeToBalance(
      tenantId,
      charge.studentAccountId,
      dto.amount,
    );

    this.logger.log(`✅ Created charge: ${charge.id} (${dto.chargeType}) for $${dto.amount}`);

    return charge;
  }

  async getCharge(tenantId: string, chargeId: string): Promise<Charge> {
    const charge = await this.repository.findById(tenantId, chargeId);

    if (!charge) {
      throw new NotFoundException(`Charge ${chargeId} not found`);
    }

    return charge;
  }

  async getStudentCharges(
    tenantId: string,
    studentAccountId: string,
  ): Promise<{ charges: Charge[]; total: number }> {
    return this.repository.findByStudentAccount(tenantId, studentAccountId);
  }

  async getOpenCharges(tenantId: string, studentAccountId: string): Promise<Charge[]> {
    return this.repository.findOpen(tenantId, studentAccountId);
  }

  async getTotalDue(tenantId: string, studentAccountId: string): Promise<number> {
    return this.repository.getTotalDue(tenantId, studentAccountId);
  }

  async getOverdueCharges(tenantId: string): Promise<Charge[]> {
    return this.repository.getOverdueCharges(tenantId);
  }

  async markChargePaid(tenantId: string, chargeId: string): Promise<Charge> {
    const charge = await this.getCharge(tenantId, chargeId);

    if (charge.status === 'paid') {
      throw new BadRequestException('Charge is already paid');
    }

    const updated = await this.repository.markPaid(chargeId);
    this.logger.log(`✅ Marked charge paid: ${chargeId}`);

    return updated;
  }
}
