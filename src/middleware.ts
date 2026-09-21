import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const AUTH_COOKIE_NAME = 'merlo_participa_session';

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const sessionCookie = request.cookies.get(AUTH_COOKIE_NAME)?.value;

  let isAuthenticated = false;
  if (sessionCookie) {
    try {
      const session = JSON.parse(decodeURIComponent(sessionCookie));
      if (session && session.email) {
        // Verify expiry if provided
        if (!session.expiresAt || session.expiresAt > Date.now()) {
          isAuthenticated = true;
        }
      }
    } catch {
      isAuthenticated = false;
    }
  }

  // Protected admin routes: must be authenticated
  if (pathname.startsWith('/admin')) {
    if (!isAuthenticated) {
      const loginUrl = new URL('/login', request.url);
      const targetPath = pathname + (search || '');
      loginUrl.searchParams.set('redirectedFrom', targetPath);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Login route: redirect to admin if already authenticated
  if (pathname === '/login') {
    if (isAuthenticated) {
      const adminUrl = new URL('/admin', request.url);
      return NextResponse.redirect(adminUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/login'],
};
