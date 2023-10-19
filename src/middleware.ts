import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['en', 'pt'],
  defaultLocale: 'pt',
  localePrefix: 'never',
});

export const config = {
  // Skip all paths that should not be internationalized
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
