'use client';

import { Link, usePathname, useRouter } from '@/common/navigation';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { SearchIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import React, { ReactNode, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

interface Props {
  children: ReactNode;
}

export default function Layout({ children }: Props) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const t = useTranslations();
  const q = searchParams.get('q');
  const city = searchParams.get('city');
  const tags = searchParams.get('tags');
  const tagsArray = tags?.split(';') || [];
  const router = useRouter();
  const [query, setQuery] = useState<string | null>(q);

  const debounce = useDebouncedCallback((q) => {
    // @ts-expect-error
    router.replace({
      pathname,
      query: {
        ...(q && {
          q,
        }),
        ...(city && {
          city,
        }),
        ...(tagsArray.length !== 0 && {
          tags: tagsArray.join(';'),
        }),
      },
    });
  }, 1000);

  return (
    <div className="p-4">
      <div className="mb-2">
        <h2 className="font-bold w-fit text-xl sm:text-2xl border-b-2 border-primary pb-1">
          {t('search-page.title')}
        </h2>
      </div>
      <div>
        <div className="relative">
          <SearchIcon strokeWidth={3} className="absolute left-4 top-4" />
          <Input
            onChange={(e) => {
              setQuery(e.target.value);
              debounce(e.target.value || null);
            }}
            className="pl-12 text-xl placeholder:text-xl h-14"
            value={query || ''}
          />
        </div>
        <div className="flex mt-2 mb-4 justify-center m-auto px-4 font-bold text-sm text-muted-foreground w-full sm:w-[432px]">
          <Link
            data-test="search-user-link"
            className={cn(
              pathname === '/search'
                ? 'border-b-2 border-blue-600 text-primary'
                : 'hover:text-foreground transition-all duration-75',
              'py-2 flex justify-center flex-1',
            )}
            href={{
              pathname: '/search',
              ...(q && { query: { q } }),
            }}
          >
            {t('search-page.options.tip.title')}
          </Link>
          <Link
            data-test="search-user-link"
            className={cn(
              pathname === '/search/user'
                ? 'border-b-2 border-blue-600 text-primary'
                : 'hover:text-foreground transition-all duration-75',
              'py-2 flex justify-center flex-1',
            )}
            href={{
              pathname: '/search/user',
              ...(q && { query: { q } }),
            }}
          >
            {t('search-page.options.user')}
          </Link>
          <Link
            data-test="search-country-link"
            className={cn(
              pathname.endsWith('/country')
                ? 'border-b-2 border-blue-600 text-primary'
                : 'hover:text-foreground transition-all duration-75',
              'py-2 flex justify-center flex-1',
            )}
            href={{
              pathname: '/search/country',
              ...(q && { query: { q } }),
            }}
          >
            {t('search-page.options.country')}
          </Link>
          <Link
            data-test="search-city-link"
            className={cn(
              pathname.includes('/city')
                ? 'border-b-2 border-blue-600 text-primary'
                : 'hover:text-foreground transition-all duration-75',
              'py-2 flex justify-center flex-1',
            )}
            href={{
              pathname: '/search/city',
              ...(q && { query: { q } }),
            }}
          >
            {t('search-page.options.city')}
          </Link>
        </div>
      </div>
      {children}
    </div>
  );
}
