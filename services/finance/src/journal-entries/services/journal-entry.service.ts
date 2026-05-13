import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class JournalEntryService {
  constructor(private prisma: PrismaService) {}

  async createJournalEntry(tenantId: string, data: any) {
    return this.prisma.journalEntry.create({
      data: {
        ...data,
        tenantId,
        debitAmount: parseFloat(data.debitAmount) || 0,
        creditAmount: parseFloat(data.creditAmount) || 0,
        status: 'draft',
      },
      include: { account: true },
    });
  }

  async getJournalEntry(tenantId: string, entryId: string) {
    return this.prisma.journalEntry.findFirst({
      where: { id: entryId, tenantId },
      include: { account: true },
    });
  }

  async listJournalEntries(tenantId: string, filters?: any) {
    return this.prisma.journalEntry.findMany({
      where: {
        tenantId,
        ...(filters?.accountId && { accountId: filters.accountId }),
        ...(filters?.status && { status: filters.status }),
        ...(filters?.from && { date: { gte: new Date(filters.from) } }),
        ...(filters?.to && { date: { lte: new Date(filters.to) } }),
      },
      include: { account: true },
      orderBy: { date: 'desc' },
      skip: filters?.skip || 0,
      take: filters?.take || 20,
    });
  }

  async postJournalEntry(tenantId: string, entryId: string) {
    const entry = await this.getJournalEntry(tenantId, entryId);
    if (!entry) return null;

    const account = await this.prisma.chartOfAccount.findFirst({
      where: { id: entry.accountId, tenantId },
    });

    if (!account) return null;

    const newBalance = account.balance + entry.creditAmount - entry.debitAmount;

    await this.prisma.chartOfAccount.update({
      where: { id: entry.accountId },
      data: { balance: newBalance },
    });

    return this.prisma.journalEntry.update({
      where: { id: entryId },
      data: { status: 'posted', postedAt: new Date() },
      include: { account: true },
    });
  }

  async reverseJournalEntry(tenantId: string, entryId: string) {
    const entry = await this.getJournalEntry(tenantId, entryId);
    if (!entry || entry.status === 'reversed') return null;

    const reversalEntry = await this.createJournalEntry(tenantId, {
      accountId: entry.accountId,
      date: new Date(),
      description: `Reversal of ${entry.description}`,
      debitAmount: entry.creditAmount,
      creditAmount: entry.debitAmount,
      referenceNumber: `REV-${entry.referenceNumber}`,
    });

    await this.prisma.journalEntry.update({
      where: { id: entryId },
      data: { status: 'reversed' },
    });

    return reversalEntry;
  }

  async validateBalancing(tenantId: string, entries: any[]) {
    const totalDebits = entries.reduce((sum, e) => sum + (parseFloat(e.debitAmount) || 0), 0);
    const totalCredits = entries.reduce((sum, e) => sum + (parseFloat(e.creditAmount) || 0), 0);

    return {
      totalDebits,
      totalCredits,
      balanced: Math.abs(totalDebits - totalCredits) < 0.01,
      difference: totalDebits - totalCredits,
    };
  }

  async getEntriesByDateRange(tenantId: string, startDate: Date, endDate: Date) {
    return this.prisma.journalEntry.findMany({
      where: {
        tenantId,
        date: { gte: startDate, lte: endDate },
        status: 'posted',
      },
      include: { account: true },
      orderBy: { date: 'asc' },
    });
  }

  async getEntryStats(tenantId: string) {
    const total = await this.prisma.journalEntry.count({ where: { tenantId } });
    const posted = await this.prisma.journalEntry.count({
      where: { tenantId, status: 'posted' },
    });
    const draft = await this.prisma.journalEntry.count({
      where: { tenantId, status: 'draft' },
    });
    const reversed = await this.prisma.journalEntry.count({
      where: { tenantId, status: 'reversed' },
    });

    return { total, posted, draft, reversed };
  }
}
