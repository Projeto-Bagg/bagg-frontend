import { createLocalizedPathnamesNavigation, Pathnames } from 'next-intl/navigation';

export const locales = ['pt', 'en'] as const;

// The `pathnames` object holds pairs of internal
// and external paths, separated by locale.
export const pathnames = {
  '/': '/',
  '/login': '/login',
  '/signup': '/signup',
  '/ranking': '/ranking',
  '/city/[slug]': '/city/[slug]',
  '/country/[slug]': '/country/[slug]',
  '/diary/[slug]': '/diary/[slug]',
  '/diary/post/[slug]': '/diary/post/[slug]',
  '/config': '/config',
  '/[slug]': '/[slug]',
  '/[slug]/likes': '/[slug]/likes',
  '/[slug]/diaries': '/[slug]/diaries',
  '/[slug]/visits': '/[slug]/visits',
  '/[slug]/settings/profile': '/[slug]/settings/profile',
} satisfies Pathnames<typeof locales>;

export const { Link, redirect, usePathname, useRouter } =
  createLocalizedPathnamesNavigation({ locales, pathnames });
