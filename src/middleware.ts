import { decodeJwt } from 'jose';
import createIntlMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const intlMiddleware = createIntlMiddleware({
    locales: ['en', 'pt'],
    defaultLocale: 'pt',
    localePrefix: 'never',
  });

  const accessToken = request.cookies.get('bagg.access-token');

  const isAuthenticated = !!accessToken;

  const sessionJwt = accessToken ? decodeJwt<UserFromJwt>(accessToken.value) : undefined;

  if (!request.nextUrl.pathname.endsWith('admin') && sessionJwt?.role === 'ADMIN') {
    return NextResponse.redirect(new URL('/admin', request.nextUrl.origin));
  }

  if (request.nextUrl.pathname.endsWith('/settings') && !isAuthenticated) {
    return NextResponse.redirect(new URL('/', request.nextUrl.origin));
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
