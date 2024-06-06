'use client';

import { Resident } from '@/app/[locale]/(country-city)/components/resident';
import axios from '@/services/axios';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

export default function Residents({ params }: { params: { slug: string } }) {
  const { ref, inView } = useInView();
  const t = useTranslations();

  const { data, fetchNextPage, hasNextPage } = useInfiniteQuery<User[]>({
    queryKey: ['city', 'residents', +params.slug],
    queryFn: async ({ pageParam }) =>
      (
        await axios.get<User[]>(`/cities/${params.slug}/residents`, {
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
        <h3 className="font-bold text-xl">
          {t('country-city-page.tabs.residents.label')}
        </h3>
      </div>
      <div>
        {data?.pages[0].length === 0 && (
          <div className="py-4 text-sm text-center text-muted-foreground">
            <span>{t('country-city-page.tabs.residents.no-residents')}</span>
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2">
          {data?.pages.map((page, index) =>
            page.map((user) => (
              <Resident
                key={user.id}
                ref={page.length - 1 === index ? ref : undefined}
                user={user}
              />
            )),
          )}
        </div>
      </div>
    </div>
  );
}
