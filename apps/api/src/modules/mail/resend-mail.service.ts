import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';
import type { IMailService } from './mail.interface';

@Injectable()
export class ResendMailService implements IMailService {
  private readonly resend: Resend;
  private readonly fromEmail: string;
  private readonly logger = new Logger(ResendMailService.name);

  constructor(private readonly config: ConfigService) {
    const apiKey = this.config.getOrThrow<string>('RESEND_API_KEY');
    this.fromEmail = this.config.get<string>('RESEND_FROM_EMAIL', 'onboarding@resend.dev');
    this.resend = new Resend(apiKey);
  }

  async send(to: string, subject: string, html: string): Promise<void> {
    try {
      await this.resend.emails.send({
        from: this.fromEmail,
        to,
        subject,
        html,
      });
      this.logger.log(`Email sent to ${to}: ${subject}`);
    } catch (error) {
      this.logger.error(`Failed to send email to ${to}: ${(error as Error).message}`);
      throw error;
    }
  }

  async sendPasswordReset(to: string, resetToken: string): Promise<void> {
    const appUrl = this.config.get<string>('FRONTEND_URL', 'http://localhost:3000');
    const resetUrl = `${appUrl}/auth/reset-password?token=${resetToken}`;

    await this.send(
      to,
      'Reset your password — DigiStore',
      `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #1a1a2e;">Password Reset</h1>
        <p>You requested a password reset for your DigiStore account.</p>
        <p>Click the button below to set a new password. This link expires in 1 hour.</p>
        <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background: #6366f1; color: #fff; border-radius: 6px; text-decoration: none; margin: 16px 0;">
          Reset Password
        </a>
        <p style="color: #6b7280; font-size: 14px;">If you didn't request this, you can safely ignore this email.</p>
      </div>
      `,
    );
  }

  async sendOrderConfirmation(to: string, orderId: string, total: number): Promise<void> {
    await this.send(
      to,
      `Order Confirmed — ${orderId}`,
      `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #1a1a2e;">Order Confirmed!</h1>
        <p>Thank you for your purchase on DigiStore.</p>
        <div style="background: #f3f4f6; border-radius: 8px; padding: 16px; margin: 16px 0;">
          <p style="margin: 0;"><strong>Order ID:</strong> ${orderId}</p>
          <p style="margin: 0;"><strong>Total:</strong> $${total.toFixed(2)}</p>
        </div>
        <p>You can access your digital products from your library at any time.</p>
        <a href="${this.config.get<string>('FRONTEND_URL', 'http://localhost:3000')}/buyer/library" style="display: inline-block; padding: 12px 24px; background: #6366f1; color: #fff; border-radius: 6px; text-decoration: none; margin: 16px 0;">
          View Library
        </a>
      </div>
      `,
    );
  }

  async sendWelcome(to: string, name: string): Promise<void> {
    await this.send(
      to,
      'Welcome to DigiStore!',
      `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #1a1a2e;">Welcome to DigiStore, ${name}!</h1>
        <p>Your account has been created successfully.</p>
        <p>Explore thousands of premium digital products — courses, templates, and assets from top creators.</p>
        <a href="${this.config.get<string>('FRONTEND_URL', 'http://localhost:3000')}/products" style="display: inline-block; padding: 12px 24px; background: #6366f1; color: #fff; border-radius: 6px; text-decoration: none; margin: 16px 0;">
          Browse Products
        </a>
      </div>
      `,
    );
  }
}