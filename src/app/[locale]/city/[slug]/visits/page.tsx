'use client';

import { Link } from '@/common/navigation';
import { CityVisit } from '@/components/city-visit';
import axios from '@/services/axios';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

export default function Visits({ params }: { params: { slug: string } }) {
  const { ref, inView } = useInView();
  const t = useTranslations();

  const { data, fetchNextPage, hasNextPage } = useInfiniteQuery<CityVisit[]>({
    queryKey: ['city-visits', +params.slug],
    queryFn: async ({ pageParam }) =>
      (
        await axios.get<CityVisit[]>(
          `/city-visits/${params.slug}?page=${pageParam}&count=15`,
        )
      ).data,
    initialPageParam: 1,
    getNextPageParam: (page, allPages) =>
      page.length === 10 ? allPages.length + 1 : null,
  });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage]);

  return (
    <div>
      <div className="flex justify-between items-baseline mb-2 pb-1 border-b-2 border-primary">
        <h3 className="font-bold text-xl">{t('country-city-page.reviews')}</h3>
        <Link
          href={{ params: { slug: params.slug }, pathname: '/city/[slug]' }}
          className="text-sm uppercase font-bold text-primary hover:underline"
        >
          {t('country-city-page.go-back')}
        </Link>
      </div>
      <div>
        {data?.pages.map((page, index) =>
          page.map((visit) => (
            <CityVisit
              ref={page.length - 1 === index ? ref : undefined}
              key={visit.id}
              visit={visit}
            />
          )),
        )}
      </div>
    </div>
  );
}
