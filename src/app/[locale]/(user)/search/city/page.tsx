'use client';

import { Link } from '@/common/navigation';
import { CitySearch } from '@/components/search/city-search';
import { useSaveQueryOnRecentSearches } from '@/hooks/recent-searches';
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
  const saveQueryOnRecentSearches = useSaveQueryOnRecentSearches();

  const { data, fetchNextPage, hasNextPage } = useInfiniteQuery<CityFromSearch[]>({
    queryKey: ['city-search', q],
    queryFn: async ({ pageParam }) =>
      (
        await axios.get<CityFromSearch[]>(`/cities/search`, {
          params: {
            q,
            count: 50,
            page: pageParam,
          },
        })
      ).data,
    initialPageParam: 1,
    getNextPageParam: (page, allPages) => {
      if (page.length === 50) {
        return allPages.length + 1;
      }

      return null;
    },
    enabled: !!q,
  });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage]);

  if (data && data.pages[0].length === 0) {
    return (
      <span className="flex justify-center font-bold">
        {t('search-page.no-results')} &quot;{q}&quot;
      </span>
    );
  }

  return (
    <div data-test="cities" className="space-y-0.5 sm:gap-x-2 sm:grid sm:grid-cols-2">
      {data &&
        data.pages.map((page) =>
          page.map((city, index) => (
            <div ref={page.length - 1 === index ? ref : undefined} key={index}>
              <CitySearch
                onClick={() => saveQueryOnRecentSearches.mutate(city)}
                city={city}
              />
            </div>
          )),
        )}
    </div>
  );
}
