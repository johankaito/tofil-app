import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const isAuth = request.cookies.get('sb-access-token');
  const { pathname } = request.nextUrl;

  // Redirect root to /login if not authenticated
  if (pathname === '/' && !isAuth) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Protect /owner, /contractor, /admin
  if ((pathname.startsWith('/owner') || pathname.startsWith('/contractor') || pathname.startsWith('/admin')) && !isAuth) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If authenticated and on /login or /signup, redirect to /owner (will be handled in client for role-based)
  if ((pathname === '/login' || pathname === '/signup') && isAuth) {
    return NextResponse.redirect(new URL('/owner', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/login', '/signup', '/owner/:path*', '/contractor/:path*', '/admin/:path*'],
}; 