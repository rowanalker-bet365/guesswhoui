import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const AUTH_TOKEN_COOKIE_NAME = 'guesswho_authtoken';

export function middleware(request: NextRequest) {
  const authToken = request.cookies.get(AUTH_TOKEN_COOKIE_NAME)?.value;

  if (request.nextUrl.pathname.startsWith('/team')) {
    if (!authToken) {
      const loginUrl = new URL('/auth/login', request.url);
      loginUrl.searchParams.set('redirected', 'true');
      return NextResponse.redirect(loginUrl);
    }
  }

  // If a team is already logged in, block access to auth pages so a second
  // team cannot log in on the same browser and overwrite the shared auth cookie.
  if (
    request.nextUrl.pathname.startsWith('/auth/login') ||
    request.nextUrl.pathname.startsWith('/auth/signup')
  ) {
    if (authToken) {
      return NextResponse.redirect(new URL('/team', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/team/:path*', '/auth/:path*'],
};