import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// We use localStorage (Zustand persist) for auth tokens — not cookies.
// Middleware can't read localStorage, so we allow all routes through here.
// Each protected layout (buyer/seller/admin) handles auth client-side using useAuthStore.
export function middleware(_request: NextRequest) {
  return NextResponse.next();
}

export const config = { matcher: [] };
