import createIntlMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const intlMiddleware = createIntlMiddleware({
    locales: ['en', 'pt'],
    defaultLocale: 'pt',
    localePrefix: 'as-needed',
  });

  const isAuthenticated = request.cookies.has('bagg.sessionToken');
  const locale = request.cookies.get('NEXT_LOCALE')?.value || 'pt';

  if (request.nextUrl.pathname.startsWith('/login') && isAuthenticated) {
    return NextResponse.redirect(new URL(locale + '/', request.url));
  }

  if (request.nextUrl.pathname.startsWith('/signup') && isAuthenticated) {
    return NextResponse.redirect(new URL(locale + '/', request.url));
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
