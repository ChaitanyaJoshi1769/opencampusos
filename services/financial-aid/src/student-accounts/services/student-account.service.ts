import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { StudentAccount } from '@prisma/client';
import { StudentAccountRepository } from '../repositories/student-account.repository';

@Injectable()
export class StudentAccountService {
  private readonly logger = new Logger(StudentAccountService.name);

  constructor(private readonly repository: StudentAccountRepository) {}

  async getOrCreateAccount(tenantId: string, studentId: string): Promise<StudentAccount> {
    let account = await this.repository.findByStudentId(tenantId, studentId);

    if (!account) {
      account = await this.repository.create(tenantId, studentId);
      this.logger.log(`✅ Created account for student: ${studentId}`);
    }

    return account;
  }

  async getAccount(tenantId: string, studentId: string): Promise<StudentAccount> {
    const account = await this.repository.findByStudentId(tenantId, studentId);

    if (!account) {
      throw new NotFoundException(
        `No account found for student ${studentId}`,
      );
    }

    return account;
  }

  async getBalance(tenantId: string, studentId: string): Promise<number> {
    return this.repository.getAccountBalance(tenantId, studentId);
  }

  async listAccounts(tenantId: string, skip?: number, take?: number) {
    return this.repository.findMany(tenantId, skip, take);
  }

  async getAccountsWithOutstandingBalance(tenantId: string) {
    return this.repository.getAccountsWithBalance(tenantId, 0);
  }

  async updateBalance(accountId: string, amount: number): Promise<StudentAccount> {
    return this.repository.updateBalance(accountId, amount);
  }

  async addChargeToBalance(
    tenantId: string,
    studentId: string,
    chargeAmount: number,
  ): Promise<StudentAccount> {
    const account = await this.getAccount(tenantId, studentId);
    const newBalance = account.balance + chargeAmount;
    return this.updateBalance(account.id, newBalance);
  }

  async applyPayment(
    tenantId: string,
    studentId: string,
    paymentAmount: number,
  ): Promise<StudentAccount> {
    const account = await this.getAccount(tenantId, studentId);
    const newBalance = Math.max(0, account.balance - paymentAmount);
    return this.updateBalance(account.id, newBalance);
  }
}
