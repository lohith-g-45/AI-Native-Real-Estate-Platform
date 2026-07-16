import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import nodemailer, { SentMessageInfo, Transporter } from 'nodemailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: Transporter | null = null;

  constructor(private readonly configService: ConfigService) {}

  private createTransporter() {
    const host = this.configService.get<string>('SMTP_HOST');
    const port = Number(this.configService.get<string>('SMTP_PORT', '587'));
    const secure = String(this.configService.get<string>('SMTP_SECURE', 'false')).toLowerCase() === 'true';
    const user = this.configService.get<string>('SMTP_USER');
    const pass = this.configService.get<string>('SMTP_PASS');

    if (!host || !port || !user || !pass) {
      this.logger.warn('SMTP is not fully configured; emails will be logged instead of sent.');
      return null;
    }

    return nodemailer.createTransport({
      host,
      port,
      secure,
      auth: {
        user,
        pass,
      },
    });
  }

  private getTransporter() {
    if (this.transporter === null) {
      this.transporter = this.createTransporter();
    }
    return this.transporter;
  }

  async sendMail(options: {
    to: string;
    subject: string;
    text: string;
    html?: string;
  }): Promise<SentMessageInfo | { messageId: string; previewUrl: string | null }> {
    const transporter = this.getTransporter();
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
