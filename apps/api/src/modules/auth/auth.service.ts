import { Injectable, ConflictException, UnauthorizedException, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { prisma } from '@ecommerce/database';
import type { Role } from '@ecommerce/database';
import { TOKEN_BLACKLIST } from '../../common/security/token-blacklist.interface';
import type { ITokenBlacklist } from '../../common/security/token-blacklist.interface';
import { MAIL_SERVICE } from '../mail/mail.token';
import type { IMailService } from '../mail/mail.interface';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { TokenPairDto } from './dto/token-pair.dto';

export interface TokenPayload {
  sub: string;
  email: string;
  role: Role;
  jti: string;
}

interface DecodedToken {
  exp?: number;
}

@Injectable()
export class AuthService {
  private readonly SALT_ROUNDS = 12;

  constructor(
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    @Inject(TOKEN_BLACKLIST) private readonly tokenBlacklist: ITokenBlacklist,
    @Inject(MAIL_SERVICE) private readonly mailService: IMailService,
  ) {}

  async register(dto: RegisterDto): Promise<TokenPairDto & { user: { id: string; email: string; role: string } }> {
    const existing = await prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) {
      throw new ConflictException('Email already in use');
    }

    const passwordHash = await bcrypt.hash(dto.password, this.SALT_ROUNDS);
    const role: Role = dto.role ?? 'BUYER';
    const user = await prisma.user.create({
      data: {
        email: dto.email,
        passwordHash,
        role,
        ...(role === 'SELLER' && dto.storeName
          ? { store: { create: { name: dto.storeName } } }
          : {}),
      },
    });

    this.mailService.sendWelcome(user.email, user.email.split('@')[0]).catch(() => {});

    const tokens = this.issueTokens(user.id, user.email, user.role);
    return { ...tokens, user: { id: user.id, email: user.email, role: user.role } };
  }

  async login(dto: LoginDto): Promise<TokenPairDto & { user: { id: string; email: string; role: string } }> {
    const user = await prisma.user.findUnique({ where: { email: dto.email } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = this.issueTokens(user.id, user.email, user.role);
    return { ...tokens, user: { id: user.id, email: user.email, role: user.role } };
  }

  async refresh(refreshToken: string): Promise<TokenPairDto> {
    try {
      const payload = await this.jwtService.verifyAsync<TokenPayload>(refreshToken, {
        secret: this.config.getOrThrow<string>('JWT_REFRESH_SECRET'),
      });

      if (await this.tokenBlacklist.isBlacklisted(payload.jti)) {
        throw new UnauthorizedException('Token has been revoked');
      }

      const user = await prisma.user.findUnique({ where: { id: payload.sub } });
      if (!user) {
        throw new UnauthorizedException('User no longer exists');
      }

      await this.tokenBlacklist.add(payload.jti, this.getRemainingMs(refreshToken));

      return this.issueTokens(user.id, user.email, user.role);
    } catch (error) {
      if (error instanceof UnauthorizedException) throw error;
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  async logout(accessToken: string | undefined, refreshToken: string | undefined): Promise<{ message: string }> {
    const accessTtl = this.parseExpiry(this.config.get<string>('JWT_ACCESS_EXPIRES_IN', '15m'));
    const refreshTtl = this.parseExpiry(this.config.get<string>('JWT_REFRESH_EXPIRES_IN', '7d'));

    if (accessToken) {
      try {
        const decoded = this.jwtService.decode(accessToken) as DecodedToken | null;
        if (decoded?.exp) {
          const remaining = Math.max(0, (decoded.exp - Math.floor(Date.now() / 1000)) * 1000);
          if (remaining > 0) {
            const payload = this.jwtService.verifyAsync<TokenPayload>(accessToken, {
              secret: this.config.getOrThrow<string>('JWT_ACCESS_SECRET'),
              ignoreExpiration: true,
            });
            const jti = (await payload.catch(() => null))?.jti;
            if (jti) await this.tokenBlacklist.add(jti, Math.min(remaining, accessTtl));
          }
        }
      } catch {}
    }

    if (refreshToken) {
      try {
        const decoded = this.jwtService.decode(refreshToken) as DecodedToken | null;
        if (decoded?.exp) {
          const remaining = Math.max(0, (decoded.exp - Math.floor(Date.now() / 1000)) * 1000);
          if (remaining > 0) {
            const payload = await this.jwtService.verifyAsync<TokenPayload>(refreshToken, {
              secret: this.config.getOrThrow<string>('JWT_REFRESH_SECRET'),
              ignoreExpiration: true,
            });
            await this.tokenBlacklist.add(payload.jti, Math.min(remaining, refreshTtl));
          }
        }
      } catch {}
    }

    return { message: 'Logged out successfully' };
  }

  async forgotPassword(dto: ForgotPasswordDto): Promise<{ message: string }> {
    const user = await prisma.user.findUnique({ where: { email: dto.email } });
    if (!user) {
      return { message: 'If that email exists, a reset link has been sent' };
    }

    const resetToken = this.jwtService.sign(
      { sub: user.id, email: user.email, purpose: 'reset-password' },
      { secret: this.config.getOrThrow<string>('JWT_ACCESS_SECRET'), expiresIn: '1h' },
    );

    await this.mailService.sendPasswordReset(user.email, resetToken);

    return { message: 'If that email exists, a reset link has been sent' };
  }

  async resetPassword(dto: ResetPasswordDto): Promise<{ message: string }> {
    try {
      const payload = this.jwtService.verifyAsync<{ sub: string; purpose: string }>(
        dto.token,
        { secret: this.config.getOrThrow<string>('JWT_ACCESS_SECRET') },
      );

      const { sub, purpose } = await payload;

      if (purpose !== 'reset-password') {
        throw new UnauthorizedException('Invalid reset token');
      }

      const passwordHash = await bcrypt.hash(dto.newPassword, this.SALT_ROUNDS);
      await prisma.user.update({
        where: { id: sub },
        data: { passwordHash },
      });

      return { message: 'Password has been reset successfully' };
    } catch {
      throw new UnauthorizedException('Invalid or expired reset token');
    }
  }

  async getProfile(userId: string): Promise<{ id: string; email: string; role: string }> {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return { id: user.id, email: user.email, role: user.role };
  }

  private issueTokens(userId: string, email: string, role: Role): TokenPairDto {
    const jti = randomUUID();
    const payload: TokenPayload = { sub: userId, email, role, jti };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.config.getOrThrow<string>('JWT_ACCESS_SECRET'),
      expiresIn: this.config.get<string>('JWT_ACCESS_EXPIRES_IN', '15m'),
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.config.getOrThrow<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.config.get<string>('JWT_REFRESH_EXPIRES_IN', '7d'),
    });

    return { accessToken, refreshToken };
  }

  private getRemainingMs(token: string): number {
    const decoded = this.jwtService.decode(token) as DecodedToken | null;
    if (!decoded?.exp) return 0;
    return Math.max(0, (decoded.exp - Math.floor(Date.now() / 1000)) * 1000);
  }

  private parseExpiry(expiry: string): number {
    const match = expiry.match(/^(\d+)([smhd])$/);
    if (!match) return 15 * 60 * 1000;
    const value = parseInt(match[1], 10);
    const unit: Record<string, number> = { s: 1000, m: 60000, h: 3600000, d: 86400000 };
    return value * (unit[match[2]] ?? 60000);
  }
}