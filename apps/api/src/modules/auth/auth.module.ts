import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { InMemoryTokenBlacklist } from '../../common/security/in-memory-token-blacklist.service';
import { TOKEN_BLACKLIST } from '../../common/security/token-blacklist.interface';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({}),
    MailModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    InMemoryTokenBlacklist,
    {
      provide: TOKEN_BLACKLIST,
      useExisting: InMemoryTokenBlacklist,
    },
  ],
  exports: [AuthService, TOKEN_BLACKLIST],
})
export class AuthModule {}