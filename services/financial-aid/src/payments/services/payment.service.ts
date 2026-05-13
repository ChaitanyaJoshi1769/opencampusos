import { Injectable, BadRequestException, Logger, NotFoundException } from '@nestjs/common';
import { Payment } from '@prisma/client';
import { PaymentRepository } from '../repositories/payment.repository';
import { ChargeRepository } from '../../charges/repositories/charge.repository';
import { StudentAccountRepository } from '../../student-accounts/repositories/student-account.repository';

export interface CreatePaymentDto {
  studentAccountId: string;
  chargeIds: string[];
  amount: number;
  paymentMethod: 'credit_card' | 'ach' | 'check' | 'cash' | 'other';
  reference?: string;
  notes?: string;
}

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);

  constructor(
    private readonly repository: PaymentRepository,
    private readonly chargeRepository: ChargeRepository,
    private readonly accountRepository: StudentAccountRepository,
  ) {}

  async createPayment(tenantId: string, dto: CreatePaymentDto): Promise<Payment> {
    if (dto.amount <= 0) {
      throw new BadRequestException('Payment amount must be positive');
    }

    if (dto.chargeIds.length === 0) {
      throw new BadRequestException('At least one charge must be specified');
    }

    const totalDue = await this.chargeRepository.getTotalDue(tenantId, dto.studentAccountId);
    if (dto.amount > totalDue) {
      throw new BadRequestException(`Payment amount exceeds total due of $${totalDue}`);
    }

    const payment = await this.repository.create(tenantId, dto.studentAccountId, {
      chargeIds: dto.chargeIds,
      amount: dto.amount,
      paymentMethod: dto.paymentMethod,
      reference: dto.reference,
      notes: dto.notes,
    });

    await this.accountRepository.updateBalance(tenantId, dto.studentAccountId, -dto.amount);

    for (const chargeId of dto.chargeIds) {
      await this.chargeRepository.markPaid(chargeId);
    }

    this.logger.log(`✅ Processed payment: ${payment.id} for $${dto.amount} via ${dto.paymentMethod}`);

    return payment;
  }

  async getPayment(tenantId: string, paymentId: string): Promise<Payment> {
    const payment = await this.repository.findById(tenantId, paymentId);

    if (!payment) {
      throw new NotFoundException(`Payment ${paymentId} not found`);
    }

    return payment;
  }

  async getStudentPayments(
    tenantId: string,
    studentAccountId: string,
  ): Promise<{ payments: Payment[]; total: number }> {
    return this.repository.findByStudentAccount(tenantId, studentAccountId);
  }

  async getPaymentsByMethod(tenantId: string, method: string): Promise<Payment[]> {
    return this.repository.findByMethod(tenantId, method);
  }

  async getTotalReceived(tenantId: string): Promise<number> {
    return this.repository.getTotalReceived(tenantId);
  }

  async getPaymentsInDateRange(
    tenantId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<Payment[]> {
    return this.repository.getPaymentsInDateRange(tenantId, startDate, endDate);
  }

  async getOutstandingPayments(tenantId: string): Promise<Payment[]> {
    return this.repository.getOutstandingPayments(tenantId);
  }

  async updatePaymentStatus(
    tenantId: string,
    paymentId: string,
    status: 'pending' | 'completed' | 'failed',
  ): Promise<Payment> {
    const payment = await this.getPayment(tenantId, paymentId);

    if (payment.status === 'refunded') {
      throw new BadRequestException('Cannot update status of refunded payment');
    }

    const updated = await this.repository.updateStatus(paymentId, status);
    this.logger.log(`✅ Updated payment status: ${paymentId} → ${status}`);

    return updated;
  }

  async refundPayment(tenantId: string, paymentId: string, refundAmount: number): Promise<Payment> {
    const payment = await this.getPayment(tenantId, paymentId);

    if (payment.status !== 'completed') {
      throw new BadRequestException('Only completed payments can be refunded');
    }

    if (refundAmount > payment.amount) {
      throw new BadRequestException('Refund amount cannot exceed original payment');
    }

    const refunded = await this.repository.refund(paymentId, refundAmount);

    await this.accountRepository.updateBalance(
      tenantId,
      payment.studentAccountId,
      refundAmount,
    );

    this.logger.log(`✅ Refunded payment: ${paymentId} - $${refundAmount}`);

    return refunded;
  }
}
