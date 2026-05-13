import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { EmailService, SendEmailDto } from './email.service';

@Controller('v1/email')
export class EmailController {
  constructor(private readonly service: EmailService) {}

  @Post('send')
  @HttpCode(201)
  async send(@Body() dto: SendEmailDto): Promise<{ status: string; data: any }> {
    const result = await this.service.sendEmail(dto);
    return { status: 'success', data: result };
  }

  @Post('bulk')
  @HttpCode(201)
  async sendBulk(
    @Body() body: { recipients: string[]; subject: string; htmlBody: string },
  ): Promise<{ status: string; data: any }> {
    const result = await this.service.sendBulkEmail(body.recipients, body.subject, body.htmlBody);
    return { status: 'success', data: result };
  }

  @Post('template')
  @HttpCode(201)
  async sendTemplate(
    @Body() body: { to: string | string[]; template: string; variables: Record<string, any> },
  ): Promise<{ status: string; data: any }> {
    const result = await this.service.sendTemplateEmail(body.to, body.template, body.variables);
    return { status: 'success', data: result };
  }
}
