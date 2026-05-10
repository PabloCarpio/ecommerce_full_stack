export interface IMailService {
  send(to: string, subject: string, html: string): Promise<void>;
  sendPasswordReset(to: string, resetToken: string): Promise<void>;
  sendOrderConfirmation(to: string, orderId: string, total: number): Promise<void>;
  sendWelcome(to: string, name: string): Promise<void>;
}