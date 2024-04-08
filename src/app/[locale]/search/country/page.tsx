'use client';

import { Link } from '@/common/navigation';
import { CountrySearch } from '@/components/search/country-search';
import axios from '@/services/axios';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

export default function Page() {
  const searchParams = useSearchParams();
  const { ref, inView } = useInView();
  const t = useTranslations();
  const q = searchParams.get('q');

  const { data, fetchNextPage, hasNextPage } = useInfiniteQuery<Country[]>({
    queryKey: ['country-search', q],
    queryFn: async ({ pageParam }) =>
      (
        await axios.get<Country[]>(`/countries/search`, {
          params: {
            q,
            page: pageParam,
            count: 20,
          },
        })
      ).data,
    initialPageParam: 1,
    getNextPageParam: (page, allPages) => {
      if (page.length === 20) {
        return allPages.length + 1;
      }

      return null;
    },
  });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage]);

  return (
    <div className="gap-y-0.5 gap-x-2 grid sm:grid-cols-2">
      {data && data.pages[0].length === 0 && (
        <span className="flex justify-center font-bold">
          {t('search-page.no-results')} &quot;{q}&quot;
        </span>
      )}
      {data &&
        data.pages.map((page) =>
          page.map((country, index) => (
            <Link
              className="block"
              key={index}
              ref={page.length - 1 === index ? ref : undefined}
              href={{ params: { slug: country.iso2 }, pathname: '/country/[slug]' }}
            >
              <CountrySearch country={country} />
            </Link>
          )),
        )}
    </div>
  );
}
