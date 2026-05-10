export interface ITokenBlacklist {
  add(jti: string, ttlMs: number): Promise<void>;
  isBlacklisted(jti: string): Promise<boolean>;
}

export const TOKEN_BLACKLIST = Symbol('ITokenBlacklist');