'use client';

import { Link } from '@/common/navigation';
import { CountryFlag } from '@/components/ui/country-flag';
import {
  Ranking,
  RankingHeader,
  RankingTitle,
  RankingContent,
  RankingSkeleton,
  RankingItem,
} from '@/components/ui/ranking';
import axios from '@/services/axios';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

export const CityInterestRanking = ({ count = 10, isPagination = false }) => {
  const t = useTranslations();
  const { ref, inView } = useInView();

  const {
    data: ranking,
    fetchNextPage,
    hasNextPage,
    isLoading,
  } = useInfiniteQuery<CityInterestRanking>({
    queryKey: ['city-interest-ranking'],
    queryFn: async ({ pageParam }) =>
      (
        await axios.get<CityInterestRanking>(`/cities/ranking/interest`, {
          params: {
            page: pageParam,
            count,
          },
        })
      ).data,
    initialPageParam: 1,
    getNextPageParam: (page, allPages) => {
      if (allPages.reduce((acc, curr) => acc + curr.length, 0) === 100) {
        return null;
      }

      if (page.length === count) {
        return allPages.length + 1;
      }

      return null;
    },
  });

  useEffect(() => {
    if (inView && hasNextPage && isPagination) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage, isPagination]);

  return (
    <Ranking>
      <RankingHeader>
        <RankingTitle>{t('ranking.cities-with-gratest-interest')}</RankingTitle>
      </RankingHeader>
      <RankingContent>
        {isLoading && <RankingSkeleton />}
        {ranking &&
          ranking.pages.map((page, pageIndex) =>
            page.map((city, index) => (
              <RankingItem
                ref={page.length - 1 === index ? ref : undefined}
                key={city.id}
              >
                <div className="flex gap-2 items-center">
                  <h3 className="w-[24px] font-bold">
                    {pageIndex * count + (index + 1)}º
                  </h3>
                  <Link
                    href={{
                      params: { slug: city.iso2 },
                      pathname: '/country/[slug]',
                    }}
                  >
                    <CountryFlag
                      className="w-[36px]"
                      iso2={city.iso2}
                      tooltip={city.name}
                    />
                  </Link>
                  <div className="flex gap-1">
                    <Link
                      className="hover:underline"
                      href={{ params: { slug: city.id }, pathname: '/city/[slug]' }}
                    >
                      <span>{city.name}</span>
                    </Link>
                    <span className="text-muted-foreground">{city.region}</span>
                  </div>
                </div>
                <div>
                  <span className="font-bold">{city.totalInterest}</span>
                </div>
              </RankingItem>
            )),
          )}
      </RankingContent>
    </Ranking>
  );
};
