'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import axios from '@/services/axios';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import React, { useState } from 'react';
import { ads } from '@/common/ads';
import { produce } from 'immer';
import { Feed } from '@/components/feed';
import { setCookie } from 'cookies-next';

type Feed = 'for-you' | 'following';

interface HomeProps {
  defaultFeed: Feed | undefined;
}

export default function Home({ defaultFeed }: HomeProps) {
  const [feed, setFeed] = useState<Feed>(defaultFeed || 'for-you');
  const t = useTranslations();

  const forYouFeed = useInfiniteQuery<(Ad | Tip)[]>({
    queryKey: ['for-you-feed'],
    queryFn: async ({ pageParam }) =>
      await axios
        .get<(Ad | Tip)[]>('/tips/recommend/feed', {
          params: {
            page: pageParam,
          },
        })
        .then((response) => spliceAdOnFeed(response.data)),
    initialPageParam: 1,
    getNextPageParam: (page, allPages) => (page.length > 3 ? allPages.length + 1 : null),
    enabled: feed === 'for-you',
  });

  const followingFeed = useInfiniteQuery<(Tip | Ad)[]>({
    queryKey: ['following-feed'],
    queryFn: async ({ pageParam }) =>
      await axios
        .get<(Tip | Ad)[]>('/tips/feed', {
          params: {
            page: pageParam,
            relevancy: true,
            follows: true,
            cityInterest: true,
          },
        })
        .then((response) => spliceAdOnFeed(response.data)),
    initialPageParam: 1,
    getNextPageParam: (page, allPages) => (page.length > 1 ? allPages.length + 1 : null),
    enabled: feed === 'following',
  });

  const onFeedChange = (value: Feed) => {
    setFeed(value);
    setCookie('bagg.default-feed', value);
  };

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
        onValueChange={(value) => onFeedChange(value as Feed)}
      >
        <div className="flex justify-center">
          <TabsList className="p-0 w-full bg-transparent">
            <TabsTrigger
              className="flex-1 sm:flex-none border-b sm:border-b-0"
              value="for-you"
            >
              <h2
                className={cn(
                  'font-bold w-fit text-base sm:text-xl pb-1',
                  feed === 'for-you' && 'border-b-2 border-primary',
                )}
              >
                {t('homepage.feed.for-you')}
              </h2>
            </TabsTrigger>
            <TabsTrigger
              className="flex-1 sm:flex-none border-b sm:border-b-0"
              value="following"
            >
              <h2
                className={cn(
                  'font-bold w-fit text-base sm:text-xl pb-1',
                  feed === 'following' && 'border-b-2 border-primary',
                )}
              >
                {t('homepage.feed.following')}
              </h2>
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="following">
          <Feed feed={followingFeed} emptyFeedComponent={<EmptyHomepageFeed />} />
        </TabsContent>
        <TabsContent value="for-you">
          <Feed feed={forYouFeed} emptyFeedComponent={<EmptyHomepageFeed />} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

const EmptyHomepageFeed = () => {
  const t = useTranslations();

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-xl font-bold">{t('homepage.empty-feed.title')}</h2>
      <span>{t('homepage.empty-feed.description')}</span>
    </div>
  );
};

const spliceAdOnFeed = (elements: (Ad | Tip)[]) => {
  return produce(elements, (draft) => {
    draft.length !== 0 &&
      draft.splice(
        Math.floor(Math.random() * (draft.length - 1 - 1 + 1) + 1),
        0,
        ads[Math.floor(Math.random() * ads.length)],
      );
  });
};
