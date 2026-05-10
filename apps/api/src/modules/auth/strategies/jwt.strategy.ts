import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { prisma } from '@ecommerce/database';
import { TOKEN_BLACKLIST } from '../../../common/security/token-blacklist.interface';
import type { ITokenBlacklist } from '../../../common/security/token-blacklist.interface';
import type { TokenPayload } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    config: ConfigService,
    @Inject(TOKEN_BLACKLIST) private readonly tokenBlacklist: ITokenBlacklist,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.getOrThrow<string>('JWT_ACCESS_SECRET'),
    });
  }

  async validate(payload: TokenPayload): Promise<{ userId: string; email: string; role: string }> {
    if (payload.jti && (await this.tokenBlacklist.isBlacklisted(payload.jti))) {
      throw new UnauthorizedException('Token has been revoked');
    }

    const user = await prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return { userId: payload.sub, email: payload.email, role: payload.role };
  }
}