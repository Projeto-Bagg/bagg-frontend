import createIntlMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const intlMiddleware = createIntlMiddleware({
    locales: ['en', 'pt'],
    defaultLocale: 'pt',
    localePrefix: 'always',
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

  if (request.nextUrl.pathname.endsWith('/settings/profile') && !isAuthenticated) {
    return NextResponse.redirect(
      new URL(
        request.nextUrl.pathname.replace('/settings/profile', ''),
        request.url.replace('/settings/profile', ''),
      ),
    );
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
