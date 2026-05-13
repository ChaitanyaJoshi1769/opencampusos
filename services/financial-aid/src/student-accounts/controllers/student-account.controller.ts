import { Controller, Get, Param, HttpCode } from '@nestjs/common';
import { StudentAccountService } from '../services/student-account.service';
import { StudentAccount } from '@prisma/client';

@Controller('v1/accounts')
export class StudentAccountController {
  constructor(private readonly service: StudentAccountService) {}

  @Get(':studentId')
  @HttpCode(200)
  async getAccount(
    @Param('studentId') studentId: string,
  ): Promise<{ status: string; data: StudentAccount }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const account = await this.service.getAccount(tenantId, studentId);

    return {
      status: 'success',
      data: account,
    };
  }

  @Get(':studentId/balance')
  @HttpCode(200)
  async getBalance(
    @Param('studentId') studentId: string,
  ): Promise<{ status: string; data: { balance: number } }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const balance = await this.service.getBalance(tenantId, studentId);

    return {
      status: 'success',
      data: { balance },
    };
  }

  @Get()
  @HttpCode(200)
  async listAccounts(): Promise<{
    status: string;
    data: { accounts: StudentAccount[]; total: number };
  }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const result = await this.service.listAccounts(tenantId, 0, 20);

    return {
      status: 'success',
      data: result,
    };
  }

  @Get('outstanding/all')
  @HttpCode(200)
  async getOutstandingAccounts(): Promise<{
    status: string;
    data: StudentAccount[];
  }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const accounts = await this.service.getAccountsWithOutstandingBalance(tenantId);

    return {
      status: 'success',
      data: accounts,
    };
  }
}
