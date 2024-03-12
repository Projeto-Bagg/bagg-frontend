'use client';

import { Tip } from '@/components/tip';
import axios from '@/services/axios';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

export default function Page() {
  const t = useTranslations();
  const { ref, inView } = useInView();

  const { data, fetchNextPage, hasNextPage } = useInfiniteQuery<Tip[]>({
    queryKey: ['feed'],
    queryFn: async ({ pageParam }) =>
      (await axios.get<Tip[]>('/tips/feed?page=' + pageParam)).data,
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
    <div className="container">
      <div className="px-4 md:px-11 pt-4">
        <h1 className="text-lg font-bold">{t('homepage.title')}</h1>
      </div>
      {data &&
        data.pages.map((page) =>
          page.map((tip, index) => (
            <Tip
              ref={page.length - 1 === index ? ref : undefined}
              tip={tip}
              key={tip.id}
            />
          )),
        )}
    </div>
  );
}
