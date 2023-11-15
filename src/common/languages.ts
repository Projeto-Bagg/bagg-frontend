import { locales } from '@/common/navigation';

export const languages = [
  {
    label: 'Português',
    locale: 'pt' as (typeof locales)[number],
    country: 'br',
  },
  {
    label: 'English',
    locale: 'en' as (typeof locales)[number],
    country: 'gb',
  },
];
