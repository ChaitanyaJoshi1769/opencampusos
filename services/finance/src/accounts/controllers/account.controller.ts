import { Controller, Get, Post, Put, Delete, Body, Param, Query, Headers } from '@nestjs/common';
import { AccountService } from '../services/account.service';

@Controller('accounts')
export class AccountController {
  constructor(private accountService: AccountService) {}

  @Post()
  async createAccount(@Body() data: any, @Headers('x-tenant-id') tenantId: string) {
    return this.accountService.createAccount(tenantId, data);
  }

  @Get()
  async listAccounts(@Query() filters: any, @Headers('x-tenant-id') tenantId: string) {
    return this.accountService.listAccounts(tenantId, filters);
  }

  @Get('trial-balance')
  async getTrialBalance(@Headers('x-tenant-id') tenantId: string) {
    return this.accountService.getTrialBalance(tenantId);
  }

  @Get('type/:accountType')
  async getByType(
    @Param('accountType') accountType: string,
    @Headers('x-tenant-id') tenantId: string,
  ) {
    return this.accountService.getAccountsByType(tenantId, accountType);
  }

  @Get(':id')
  async getAccount(
    @Param('id') accountId: string,
    @Headers('x-tenant-id') tenantId: string,
  ) {
    return this.accountService.getAccount(tenantId, accountId);
  }

  @Get(':id/balance')
  async getBalance(
    @Param('id') accountId: string,
    @Headers('x-tenant-id') tenantId: string,
  ) {
    return this.accountService.getAccountBalance(tenantId, accountId);
  }

  @Put(':id/balance')
  async updateBalance(
    @Param('id') accountId: string,
    @Body() body: { amount: number },
    @Headers('x-tenant-id') tenantId: string,
  ) {
    return this.accountService.updateAccountBalance(tenantId, accountId, body.amount);
  }

  @Delete(':id')
  async deleteAccount(
    @Param('id') accountId: string,
    @Headers('x-tenant-id') tenantId: string,
  ) {
    return this.accountService.deleteAccount(tenantId, accountId);
  }
}
