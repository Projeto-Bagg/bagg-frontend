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
      <div className="flex justify-between">
        <h3 className="text-sm sm:text-base uppercase">{t('city-page.reviews')}</h3>
        <Link
          href={{ params: { slug: params.slug }, pathname: '/city/[slug]' }}
          className="text-sm sm:text-base uppercase font-bold text-primary"
        >
          {t('city-page.go-back')}
        </Link>
      </div>
      <div className="pt-2">
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
