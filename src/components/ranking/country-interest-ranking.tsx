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

export const CountryInterestRanking = ({ count = 10, isPagination = false }) => {
  const t = useTranslations();
  const { ref, inView } = useInView();

  const {
    data: ranking,
    fetchNextPage,
    hasNextPage,
    isLoading,
  } = useInfiniteQuery<CountryInterestRanking>({
    queryKey: ['country-interest-ranking'],
    queryFn: async ({ pageParam }) =>
      (
        await axios.get<CountryInterestRanking>(`/countries/ranking/interest`, {
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
        <RankingTitle>{t('ranking.countries-with-gratest-interest')}</RankingTitle>
      </RankingHeader>
      <RankingContent>
        {isLoading && <RankingSkeleton />}
        {ranking &&
          ranking.pages.map((page, pageIndex) =>
            page.map((country, index) => (
              <RankingItem ref={page.length - 1 === index ? ref : undefined} key={index}>
                <div className="flex gap-2 items-center">
                  <h3 className="w-[24px] font-bold shrink-0">
                    {pageIndex * count + (index + 1)}º
                  </h3>
                  <Link
                    href={{
                      params: { slug: country.iso2 },
                      pathname: '/country/[slug]',
                    }}
                  >
                    <CountryFlag
                      tooltip={country.name}
                      className="w-[36px]"
                      iso2={country.iso2}
                    />
                  </Link>
                  <Link
                    className="hover:underline"
                    href={{
                      params: { slug: country.iso2 },
                      pathname: '/country/[slug]',
                    }}
                  >
                    <span>{country.name}</span>
                  </Link>
                </div>
                <div>
                  <span className="font-bold">{country.totalInterest}</span>
                </div>
              </RankingItem>
            )),
          )}
      </RankingContent>
    </Ranking>
  );
};
