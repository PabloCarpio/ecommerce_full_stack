import { Injectable, Logger } from '@nestjs/common';
import type { IMailService } from './mail.interface';

@Injectable()
export class ConsoleMailService implements IMailService {
  private readonly logger = new Logger(ConsoleMailService.name);

  async send(to: string, subject: string, html: string): Promise<void> {
    this.logger.warn(`[MAIL CONSOLE] To: ${to} | Subject: ${subject}`);
    this.logger.debug(`[MAIL CONSOLE] Body: ${html.substring(0, 200)}...`);
  }

  async sendPasswordReset(to: string, resetToken: string): Promise<void> {
    this.logger.log(`[PASSWORD RESET] To: ${to} | Token: ${resetToken}`);
  }

  async sendOrderConfirmation(to: string, orderId: string, total: number): Promise<void> {
    this.logger.log(`[ORDER CONFIRMATION] To: ${to} | Order: ${orderId} | Total: $${total.toFixed(2)}`);
  }

  async sendWelcome(to: string, name: string): Promise<void> {
    this.logger.log(`[WELCOME] To: ${to} | Name: ${name}`);
  }
}