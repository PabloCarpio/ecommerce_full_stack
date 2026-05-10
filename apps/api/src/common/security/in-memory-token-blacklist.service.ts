import { Injectable } from '@nestjs/common';
import { TOKEN_BLACKLIST } from './token-blacklist.interface';

@Injectable()
export class InMemoryTokenBlacklist {
  private readonly store = new Map<string, number>();

  async add(jti: string, ttlMs: number): Promise<void> {
    const expiresAt = Date.now() + ttlMs;
    this.store.set(jti, expiresAt);
    setTimeout(() => this.store.delete(jti), ttlMs);
  }

  async isBlacklisted(jti: string): Promise<boolean> {
    const expiresAt = this.store.get(jti);
    if (!expiresAt) return false;
    if (Date.now() > expiresAt) {
      this.store.delete(jti);
      return false;
    }
    return true;
  }
}