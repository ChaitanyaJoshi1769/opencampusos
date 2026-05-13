import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { SmsService, SendSmsDto } from './sms.service';

@Controller('v1/sms')
export class SmsController {
  constructor(private readonly service: SmsService) {}

  @Post('send')
  @HttpCode(201)
  async send(@Body() dto: SendSmsDto): Promise<{ status: string; data: any }> {
    const result = await this.service.sendSms(dto);
    return { status: 'success', data: result };
  }

  @Post('bulk')
  @HttpCode(201)
  async sendBulk(@Body() body: { recipients: string[]; message: string }): Promise<{ status: string; data: any }> {
    const result = await this.service.sendBulkSms(body.recipients, body.message);
    return { status: 'success', data: result };
  }
}
