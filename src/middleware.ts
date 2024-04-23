import createIntlMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const intlMiddleware = createIntlMiddleware({
    locales: ['en', 'pt'],
    defaultLocale: 'pt',
    localePrefix: 'never',
  });

  const isAuthenticated = request.cookies.has('bagg.sessionToken');

  if (request.nextUrl.pathname.endsWith('/login') && isAuthenticated) {
    return NextResponse.redirect(new URL('/', request.nextUrl.origin));
  }

  if (request.nextUrl.pathname.endsWith('/signup') && isAuthenticated) {
    return NextResponse.redirect(new URL('/', request.nextUrl.origin));
  }

  if (request.nextUrl.pathname.endsWith('/settings') && !isAuthenticated) {
    return NextResponse.redirect(new URL('/', request.nextUrl.origin));
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
