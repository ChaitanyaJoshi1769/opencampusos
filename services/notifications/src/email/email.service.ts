import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

export interface SendEmailDto {
  to: string | string[];
  subject: string;
  htmlBody?: string;
  textBody?: string;
  cc?: string[];
  bcc?: string[];
  attachments?: Array<{ filename: string; content: Buffer | string }>;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;

  constructor() {
    this.initializeTransporter();
  }

  private initializeTransporter() {
    if (process.env.EMAIL_PROVIDER === 'smtp') {
      this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
    } else {
      // Use Ethereal test account for development
      this.transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
          user: 'test@ethereal.email',
          pass: 'testpassword',
        },
      });
    }
  }

  async sendEmail(dto: SendEmailDto): Promise<any> {
    if (!dto.to || (!dto.htmlBody && !dto.textBody)) {
      throw new BadRequestException('Recipient(s) and email body are required');
    }

    const mailOptions = {
      from: process.env.EMAIL_FROM || 'noreply@opencampusos.edu',
      to: Array.isArray(dto.to) ? dto.to.join(',') : dto.to,
      cc: dto.cc?.join(','),
      bcc: dto.bcc?.join(','),
      subject: dto.subject,
      html: dto.htmlBody,
      text: dto.textBody,
      attachments: dto.attachments,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      this.logger.log(`✅ Email sent: ${info.messageId}`);

      return {
        id: 'EMAIL-' + Date.now(),
        messageId: info.messageId,
        to: dto.to,
        subject: dto.subject,
        status: 'sent',
        sentAt: new Date(),
      };
    } catch (error) {
      this.logger.error(`Email sending failed: ${error.message}`);
      throw new BadRequestException(`Email sending failed: ${error.message}`);
    }
  }

  async sendBulkEmail(recipients: string[], subject: string, htmlBody: string): Promise<any> {
    this.logger.log(`Sending bulk email to ${recipients.length} recipients`);

    const sendPromises = recipients.map((recipient) =>
      this.sendEmail({ to: recipient, subject, htmlBody }),
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

  async sendTemplateEmail(
    to: string | string[],
    templateName: string,
    variables: Record<string, any>,
  ): Promise<any> {
    let htmlBody = this.getTemplate(templateName, variables);

    return this.sendEmail({
      to,
      subject: variables.subject || templateName,
      htmlBody,
    });
  }

  private getTemplate(templateName: string, variables: Record<string, any>): string {
    const templates: Record<string, string> = {
      welcome: `<h1>Welcome ${variables.firstName}!</h1><p>Welcome to OpenCampusOS</p>`,
      enrollment_confirmation: `<h1>Enrollment Confirmed</h1><p>You are enrolled in ${variables.courseName}</p>`,
      grade_notification: `<h1>Grade Posted</h1><p>Your grade in ${variables.courseName}: ${variables.grade}</p>`,
      financial_aid_update: `<h1>Financial Aid Update</h1><p>Your aid package: $${variables.amount}</p>`,
      payment_reminder: `<h1>Payment Reminder</h1><p>Amount Due: $${variables.amount}</p>`,
      password_reset: `<h1>Reset Your Password</h1><a href="${variables.resetUrl}">Reset Password</a>`,
    };

    return templates[templateName] || `<p>${JSON.stringify(variables)}</p>`;
  }
}
