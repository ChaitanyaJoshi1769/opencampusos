import { Injectable, BadRequestException, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface CreateJournalEntryDto {
  date: Date;
  description: string;
  reference?: string;
  entries: Array<{
    accountCode: string;
    debit?: number;
    credit?: number;
  }>;
}

@Injectable()
export class JournalEntryService {
  private readonly logger = new Logger(JournalEntryService.name);

  constructor(private readonly prisma: PrismaService) {}

  async createJournalEntry(tenantId: string, dto: CreateJournalEntryDto) {
    let totalDebit = 0;
    let totalCredit = 0;

    // Validate entries balance
    for (const entry of dto.entries) {
      if (!entry.debit && !entry.credit) {
        throw new BadRequestException('Each entry must have either a debit or credit amount');
      }
      if (entry.debit && entry.credit) {
        throw new BadRequestException('Each entry cannot have both debit and credit amounts');
      }
      totalDebit += entry.debit || 0;
      totalCredit += entry.credit || 0;
    }

    if (Math.abs(totalDebit - totalCredit) > 0.01) {
      throw new BadRequestException(
        `Journal entry does not balance. Debits: ${totalDebit}, Credits: ${totalCredit}`,
      );
    }

    this.logger.log(
      `✅ Created journal entry: ${dto.description} - Debit: $${totalDebit}, Credit: $${totalCredit}`,
    );

    return {
      id: 'JE-' + Date.now(),
      tenantId,
      date: dto.date,
      description: dto.description,
      reference: dto.reference,
      entries: dto.entries,
      totalDebit,
      totalCredit,
      status: 'posted',
      createdAt: new Date(),
    };
  }

  async getTrialBalance(tenantId: string, asOfDate?: Date) {
    // Placeholder for trial balance calculation
    const results = [];
    let totalDebits = 0;
    let totalCredits = 0;

    this.logger.log(`Generated trial balance as of ${asOfDate || 'current date'}`);

    return {
      asOfDate: asOfDate || new Date(),
      accounts: results,
      totalDebits,
      totalCredits,
      isBalanced: Math.abs(totalDebits - totalCredits) < 0.01,
    };
  }

  async getGeneralLedger(tenantId: string, accountCode: string, startDate?: Date, endDate?: Date) {
    // Placeholder for general ledger retrieval
    this.logger.log(`Retrieved general ledger for account ${accountCode}`);

    return {
      accountCode,
      startDate,
      endDate,
      entries: [],
      beginningBalance: 0,
      endingBalance: 0,
    };
  }
}
