import { createLocalizedPathnamesNavigation, Pathnames } from 'next-intl/navigation';

export const locales = ['pt', 'en'] as const;

export const pathnames = {
  '/': '/',
  '/home': '/home',
  '/login': '/login',
  '/signup': '/signup',
  '/ranking': '/ranking',
  '/admin': '/admin',
  '/search': '/search',
  '/search/user': '/search/user',
  '/search/city': '/search/city',
  '/search/country': '/search/country',
  '/settings': '/settings',
  '/settings/verify-email': '/settings/verify-email',
  '/settings/verify-email/done': '/settings/verify-email/done',
  '/settings/reset-password': '/settings/reset-password',
  '/settings/reset-password/done': '/settings/reset-password/done',
  '/settings/reset-password/reset': '/settings/reset-password/reset',
  '/city/ranking/rating': '/city/ranking/rating',
  '/city/ranking/visits': '/city/ranking/visits',
  '/city/[slug]': '/city/[slug]',
  '/city/[slug]/visits': '/city/[slug]/visits',
  '/city/[slug]/residents': '/city/[slug]/residents',
  '/city/[slug]/gallery': '/city/[slug]/gallery',
  '/country/ranking/rating': '/country/ranking/rating',
  '/country/ranking/visits': '/country/ranking/visits',
  '/country/[slug]/visits': '/country/[slug]/visits',
  '/country/[slug]/residents': '/country/[slug]/residents',
  '/country/[slug]/gallery': '/country/[slug]/gallery',
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
