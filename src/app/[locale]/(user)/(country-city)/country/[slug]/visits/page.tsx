'use client';

import { CityVisit } from '@/app/[locale]/(user)/(country-city)/components/city-visit';
import axios from '@/services/axios';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

export default function Visits({ params }: { params: { slug: string } }) {
  const { ref, inView } = useInView();
  const t = useTranslations();

  const { data, fetchNextPage, hasNextPage } = useInfiniteQuery<CountryCityVisit[]>({
    queryKey: ['city-visits', 'country', params.slug],
    queryFn: async ({ pageParam }) =>
      (
        await axios.get<CountryCityVisit[]>(`/city-visits/country/${params.slug}`, {
          params: {
            page: pageParam,
            count: 5,
          },
        })
      ).data,
    initialPageParam: 1,
    getNextPageParam: (page, allPages) =>
      page.length === 5 ? allPages.length + 1 : null,
  });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage]);

  return (
    <div>
      <div className="mb-2 pb-1 border-b-2 border-primary">
        <h3 className="font-bold text-xl">{t('country-city-page.reviews')}</h3>
      </div>
      <div>
        {data?.pages[0].length === 0 && (
          <div className="py-4 text-sm text-center text-muted-foreground">
            <span>{t('country-city-page.tabs.reviews.no-reviews')}</span>
          </div>
        )}
        {data?.pages.map((page) =>
          page.map((visit, index) => (
            <CityVisit
              ref={page.length - 1 === index ? ref : undefined}
              key={visit.id}
              visit={visit}
              city={visit.city}
            />
          )),
        )}
      </div>
    </div>
  );
}
