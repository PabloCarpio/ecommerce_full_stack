import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedRoutes = ['/seller', '/buyer', '/admin'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));

  if (!isProtected) return NextResponse.next();

  const token = request.cookies.get('auth-storage')?.value;
  const hasAuth = typeof window !== 'undefined' ? localStorage.getItem('auth-storage') : null;

  if (!token && !hasAuth) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  return NextResponse.next();
}

export const config = { matcher: ['/seller/:path*', '/buyer/:path*', '/admin/:path*'] };
