import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import nodemailer, { SentMessageInfo, Transporter } from 'nodemailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: Transporter | null = null;

  constructor(private readonly configService: ConfigService) {}

  private async createTransporter() {
    const host = this.configService.get<string>('SMTP_HOST');
    const port = Number(this.configService.get<string>('SMTP_PORT', '587'));
    const secure = String(this.configService.get<string>('SMTP_SECURE', 'false')).toLowerCase() === 'true';
    const user = this.configService.get<string>('SMTP_USER');
    const pass = this.configService.get<string>('SMTP_PASS');

    if (process.env.NODE_ENV === 'test') {
      this.logger.warn('Test mode; emails will be logged instead of sent.');
      return null;
    }

    if (!host || !port || !user || !pass) {
      this.logger.warn('SMTP is not fully configured. Creating ethereal test account...');
      const testAccount = await nodemailer.createTestAccount();
      return nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
    }

    return nodemailer.createTransport({
      host,
      port,
      secure,
      auth: {
        user,
        pass,
      },
      connectionTimeout: 10000,
      socketTimeout: 10000,
      greetingTimeout: 10000,
    });
  }

  private async getTransporter() {
    if (this.transporter === null) {
      this.transporter = await this.createTransporter();
    }
    return this.transporter;
  }

  async sendMail(options: {
    to: string;
    subject: string;
    text: string;
    html?: string;
  }): Promise<SentMessageInfo | { messageId: string; previewUrl: string | null }> {
    const transporter = await this.getTransporter();
    const from = this.configService.get<string>('SMTP_FROM', 'no-reply@example.com');

    if (!transporter) {
      const previewUrl = null;
      this.logger.log(`Mock email to=${options.to} subject=${options.subject} text=${options.text}`);
      return { messageId: 'mock', previewUrl };
    }

    const info = await transporter.sendMail({
      from,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    });

    const previewUrl = nodemailer.getTestMessageUrl(info) ?? null;
    if (previewUrl) {
      this.logger.log(`Email preview available at: ${previewUrl}`);
    }

    return { ...info, previewUrl };
  }
}
