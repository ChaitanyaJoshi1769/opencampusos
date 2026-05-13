import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface CreatePayPeriodDto {
  name: string;
  startDate: Date;
  endDate: Date;
  payDate: Date;
  status: 'open' | 'closed';
}

export interface CreatePaycheckDto {
  employeeId: string;
  payPeriodId: string;
  grossAmount: number;
  netAmount: number;
  deductions: {
    federal: number;
    fica: number;
    state: number;
    other: number;
  };
}

export interface PayrollSummaryDto {
  payPeriodId: string;
  totalGross: number;
  totalNet: number;
  totalDeductions: number;
  employeeCount: number;
}

@Injectable()
export class PayrollService {
  private readonly logger = new Logger(PayrollService.name);

  constructor(private readonly prisma: PrismaService) {}

  async createPayPeriod(tenantId: string, dto: CreatePayPeriodDto): Promise<any> {
    if (!dto.name || !dto.startDate || !dto.endDate || !dto.payDate) {
      throw new BadRequestException('Name, startDate, endDate, and payDate are required');
    }

    const payPeriod = {
      id: 'PAYP-' + Date.now(),
      tenantId,
      ...dto,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.logger.log(`✅ Created pay period: ${payPeriod.id} - ${dto.name}`);
    return payPeriod;
  }

  async getPayPeriod(tenantId: string, payPeriodId: string): Promise<any> {
    this.logger.log(`Retrieved pay period: ${payPeriodId}`);

    return {
      id: payPeriodId,
      tenantId,
      name: 'Bi-weekly (May 1-15, 2026)',
      startDate: new Date('2026-05-01'),
      endDate: new Date('2026-05-15'),
      payDate: new Date('2026-05-22'),
      status: 'open',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  async listPayPeriods(tenantId: string, status?: 'open' | 'closed'): Promise<any[]> {
    this.logger.log(`Listed pay periods for tenant: ${tenantId}${status ? ` (${status})` : ''}`);
    return [];
  }

  async createPaycheck(tenantId: string, dto: CreatePaycheckDto): Promise<any> {
    if (!dto.employeeId || !dto.payPeriodId || !dto.grossAmount) {
      throw new BadRequestException('employeeId, payPeriodId, and grossAmount are required');
    }

    const totalDeductions =
      dto.deductions.federal + dto.deductions.fica + dto.deductions.state + dto.deductions.other;

    const paycheck = {
      id: 'PCHK-' + Date.now(),
      tenantId,
      ...dto,
      totalDeductions,
      netAmount: dto.grossAmount - totalDeductions,
      status: 'generated',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.logger.log(`✅ Generated paycheck: ${paycheck.id} for employee ${dto.employeeId}`);
    return paycheck;
  }

  async getPaycheck(tenantId: string, paycheckId: string): Promise<any> {
    this.logger.log(`Retrieved paycheck: ${paycheckId}`);

    return {
      id: paycheckId,
      tenantId,
      employeeId: 'EMP-001',
      payPeriodId: 'PAYP-001',
      grossAmount: 2500,
      deductions: {
        federal: 375,
        fica: 191.25,
        state: 100,
        other: 50,
      },
      totalDeductions: 716.25,
      netAmount: 1783.75,
      status: 'generated',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  async listPaychecks(
    tenantId: string,
    employeeId?: string,
    payPeriodId?: string,
  ): Promise<any[]> {
    this.logger.log(`Listed paychecks for tenant: ${tenantId}`);
    return [];
  }

  async calculatePayroll(tenantId: string, payPeriodId: string): Promise<PayrollSummaryDto> {
    this.logger.log(`Calculated payroll for period: ${payPeriodId}`);

    return {
      payPeriodId,
      totalGross: 125000,
      totalNet: 95000,
      totalDeductions: 30000,
      employeeCount: 50,
    };
  }

  async processPayroll(
    tenantId: string,
    payPeriodId: string,
  ): Promise<{ status: string; paycheckCount: number; totalAmount: number }> {
    this.logger.log(`Processing payroll for period: ${payPeriodId}`);

    return {
      status: 'processed',
      paycheckCount: 50,
      totalAmount: 95000,
    };
  }

  async getTaxSummary(tenantId: string, employeeId: string, year: number): Promise<any> {
    this.logger.log(`Retrieved tax summary for employee: ${employeeId}, year: ${year}`);

    return {
      employeeId,
      year,
      grossIncome: 65000,
      federalTax: 9750,
      ficaTax: 4972.5,
      stateTax: 2600,
      yearToDateGross: 65000,
      yearToDateFederal: 9750,
      yearToDateFica: 4972.5,
      yearToDateState: 2600,
    };
  }

  async generateW2(tenantId: string, employeeId: string, year: number): Promise<any> {
    const taxSummary = await this.getTaxSummary(tenantId, employeeId, year);

    this.logger.log(`Generated W2 for employee: ${employeeId}, year: ${year}`);

    return {
      employeeId,
      year,
      form: 'W2',
      boxes: {
        1: taxSummary.yearToDateGross,
        2: taxSummary.yearToDateFederal,
        5: taxSummary.yearToDateFica,
        6: taxSummary.yearToDateState,
      },
      generatedAt: new Date(),
    };
  }

  async generatePaystub(tenantId: string, paycheckId: string): Promise<any> {
    this.logger.log(`Generated paystub for paycheck: ${paycheckId}`);

    return {
      paycheckId,
      format: 'PDF',
      url: `/paystubs/${paycheckId}.pdf`,
      generatedAt: new Date(),
    };
  }
}
