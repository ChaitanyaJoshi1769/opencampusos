import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import * as twilio from 'twilio';

export interface SendSmsDto {
  to: string | string[];
  message: string;
}

@Injectable()
export class SmsService {
  private readonly logger = new Logger(SmsService.name);
  private client: twilio.Twilio;
  private fromNumber: string;

  constructor() {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;

    if (accountSid && authToken) {
      this.client = twilio(accountSid, authToken);
      this.fromNumber = process.env.TWILIO_PHONE_NUMBER || '+1234567890';
    }
  }

  async sendSms(dto: SendSmsDto): Promise<any> {
    if (!dto.to || !dto.message) {
      throw new BadRequestException('Phone number(s) and message are required');
    }

    if (!this.client) {
      this.logger.warn('SMS service not configured, returning mock response');
      return {
        id: 'SMS-' + Date.now(),
        to: dto.to,
        status: 'sent',
        sentAt: new Date(),
      };
    }

    try {
      const recipients = Array.isArray(dto.to) ? dto.to : [dto.to];
      const sendPromises = recipients.map((phone) =>
        this.client.messages.create({
          body: dto.message,
          from: this.fromNumber,
          to: phone,
        }),
      );

      const results = await Promise.all(sendPromises);

      this.logger.log(`✅ SMS sent to ${recipients.length} recipient(s)`);

      return {
        id: 'SMS-' + Date.now(),
        to: dto.to,
        messageIds: results.map((r) => r.sid),
        status: 'sent',
        sentAt: new Date(),
      };
    } catch (error) {
      this.logger.error(`SMS sending failed: ${error.message}`);
      throw new BadRequestException(`SMS sending failed: ${error.message}`);
    }
  }

  async sendBulkSms(recipients: string[], message: string): Promise<any> {
    this.logger.log(`Sending SMS to ${recipients.length} recipients`);

    const sendPromises = recipients.map((phone) =>
      this.sendSms({ to: phone, message }),
    );

    const results = await Promise.allSettled(sendPromises);

    const successful = results.filter((r) => r.status === 'fulfilled').length;
    const failed = results.filter((r) => r.status === 'rejected').length;

    return {
      totalSent: recipients.length,
      successful,
      failed,
      timestamp: new Date(),
    };
  }
}
