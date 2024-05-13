'use client';

import { Tip } from '@/components/posts/tip';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import axios from '@/services/axios';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import React, { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';

type Feed = 'for-you' | 'following';

export default function Home() {
  const [feed, setFeed] = useState<Feed>('following');
  const t = useTranslations();

  return (
    <div data-test="homepage-feed" className="p-4 container">
      <div className="mb-2">
        <h2 className="font-bold w-fit text-xl sm:text-2xl border-b-2 border-primary pb-1">
          {t('homepage.title')}
        </h2>
      </div>
      <Tabs
        value={feed}
        defaultValue="for-you"
        onValueChange={(value) => setFeed(value as Feed)}
      >
        <div className="flex justify-center">
          <TabsList className="p-0 bg-transparent">
            <TabsTrigger value="following">
              <div>
                <h2
                  className={cn(
                    'font-bold w-fit text-xl  pb-1',
                    feed === 'following' && 'border-b-2 border-primary',
                  )}
                >
                  {t('homepage.feed.following')}
                </h2>
              </div>
            </TabsTrigger>
            <TabsTrigger value="for-you">
              <div>
                <h2
                  className={cn(
                    'font-bold w-fit text-xl  pb-1',
                    feed === 'for-you' && 'border-b-2 border-primary',
                  )}
                >
                  {t('homepage.feed.for-you')}
                </h2>
              </div>
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="following">
          <FollowingFeed />
        </TabsContent>
        <TabsContent value="for-you">
          <ForYouFeed />
        </TabsContent>
      </Tabs>
    </div>
  );
}

const ForYouFeed = () => {
  const t = useTranslations();
  const { ref, inView } = useInView();

  const { data, fetchNextPage, hasNextPage } = useInfiniteQuery<Tip[]>({
    queryKey: ['for-you-feed'],
    queryFn: async ({ pageParam }) =>
      (
        await axios.get<Tip[]>('/tips/recommend/feed', {
          params: {
            page: pageParam,
          },
        })
      ).data,
    initialPageParam: 1,
    getNextPageParam: (page, allPages) => (page.length > 3 ? allPages.length + 1 : null),
  });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage]);

  if (data && data.pages[0].length === 0) {
    return (
      <div className="flex flex-col items-center">
        <h2 className="text-xl font-bold">{t('homepage.empty-feed.title')}</h2>
        <span>{t('homepage.empty-feed.description')}</span>
      </div>
    );
  }

  return (
    data &&
    data.pages.map((page) =>
      page.map((tip, index) => (
        <Tip ref={page.length - 1 === index ? ref : undefined} tip={tip} key={tip.id} />
      )),
    )
  );
};

const FollowingFeed = () => {
  const { ref, inView } = useInView();
  const t = useTranslations();

  const { data, fetchNextPage, hasNextPage } = useInfiniteQuery<Tip[]>({
    queryKey: ['following-feed'],
    queryFn: async ({ pageParam }) =>
      (
        await axios.get<Tip[]>('/tips/feed', {
          params: {
            page: pageParam,
            relevancy: true,
            follows: true,
            cityInterest: true,
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

  if (data && data.pages[0].length === 0) {
    return (
      <div className="flex flex-col items-center">
        <h2 className="text-xl font-bold">{t('homepage.empty-feed.title')}</h2>
        <span>{t('homepage.empty-feed.description')}</span>
      </div>
    );
  }

  return (
    data &&
    data.pages.map((page) =>
      page.map((tip, index) => (
        <Tip ref={page.length - 1 === index ? ref : undefined} tip={tip} key={tip.id} />
      )),
    )
  );
};
