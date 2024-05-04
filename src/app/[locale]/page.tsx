'use client';

import { Tip } from '@/components/posts/tip';
import { useAuth } from '@/context/auth-context';
import axios from '@/services/axios';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

export default function Page() {
  const t = useTranslations();
  const auth = useAuth();
  const { ref, inView } = useInView();

  const { data, fetchNextPage, hasNextPage } = useInfiniteQuery<Tip[]>({
    queryKey: ['feed'],
    queryFn: async ({ pageParam }) =>
      (
        await axios.get<Tip[]>('/tips/feed', {
          params: {
            page: pageParam,
            relevancy: true,
            ...(auth.user && {
              follows: true,
              cityInterest: true,
            }),
          },
        })
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
    <div data-test="homepage-feed" className="p-4">
      <div>
        <h2 className="font-bold w-fit text-xl sm:text-2xl border-b-2 border-primary pb-1">
          {t('homepage.title')}
        </h2>
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
