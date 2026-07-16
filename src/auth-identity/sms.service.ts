import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Twilio from 'twilio';

type TwilioClient = ReturnType<typeof Twilio>;

@Injectable()
export class SmsService {
  private readonly logger = new Logger(SmsService.name);

  constructor(private readonly configService: ConfigService) {}

  private getClient(): TwilioClient | null {
    const accountSid = this.configService.get<string>('TWILIO_ACCOUNT_SID');
    const authToken = this.configService.get<string>('TWILIO_AUTH_TOKEN');

    if (!accountSid || !authToken) {
      this.logger.warn('Twilio is not configured; SMS will be logged instead of sent.');
      return null;
    }

    return Twilio(accountSid, authToken);
  }

  async sendSms(to: string, body: string) {
    const from = this.configService.get<string>('TWILIO_FROM');
    const client = this.getClient();

    if (!client || !from) {
      this.logger.log(`Mock SMS to=${to} body=${body}`);
      return { message: 'SMS mock logged' };
    }

    const message = await client.messages.create({ to, from, body });
    this.logger.log(`Twilio message sent to ${to}, sid=${message.sid}`);
    return message;
  }
}
