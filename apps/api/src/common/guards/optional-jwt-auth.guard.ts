import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  override handleRequest<TUser>(err: Error | null, user: TUser | false): TUser | null {
    if (err) return null as TUser | null;
    return (user ?? null) as TUser | null;
  }
}