import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MAIL_SERVICE } from './mail.token';
import { ResendMailService } from './resend-mail.service';
import { ConsoleMailService } from './console-mail.service';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: MAIL_SERVICE,
      useClass: process.env['NODE_ENV'] === 'production' ? ResendMailService : ConsoleMailService,
    },
  ],
  exports: [MAIL_SERVICE],
})
export class MailModule {}