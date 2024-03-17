import { createLocalizedPathnamesNavigation, Pathnames } from 'next-intl/navigation';

export const locales = ['pt', 'en'] as const;

export const pathnames = {
  '/': '/',
  '/login': '/login',
  '/signup': '/signup',
  '/ranking': '/ranking',
  '/config': '/config',
  '/city/ranking/rating': '/city/ranking/rating',
  '/city/ranking/visits': '/city/ranking/visits',
  '/city/[slug]': '/city/[slug]',
  '/city/[slug]/visits': '/city/[slug]/visits',
  '/country/ranking/rating': '/country/ranking/rating',
  '/country/ranking/visits': '/country/ranking/visits',
  '/country/[slug]': '/country/[slug]',
  '/diary/[slug]': '/diary/[slug]',
  '/diary/post/[slug]': '/diary/post/[slug]',
  '/tip/[slug]': '/tip/[slug]',
  '/[slug]': '/[slug]',
  '/[slug]/diary-posts': '/[slug]/diary-posts',
  '/[slug]/diaries': '/[slug]/diaries',
  '/[slug]/visits': '/[slug]/visits',
  '/[slug]/settings/profile': '/[slug]/settings/profile',
} satisfies Pathnames<typeof locales>;

export const { Link, redirect, usePathname, useRouter } =
  createLocalizedPathnamesNavigation({ locales, pathnames });
