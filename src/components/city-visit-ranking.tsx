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
  RankingFooter,
} from '@/components/ui/ranking';
import axios from '@/services/axios';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

interface CityVisitRankingProps {
  count?: number;
  isPagination?: boolean;
  seeMore?: boolean;
  countryIso2?: string;
  skeleton?: boolean;
}

export const CityVisitRanking = ({
  count = 10,
  isPagination = false,
  seeMore,
  countryIso2,
  skeleton = true,
}: CityVisitRankingProps) => {
  const t = useTranslations();
  const { ref, inView } = useInView();
  const searchParams = useSearchParams();
  const date = searchParams.get('date');
  const iso2 = countryIso2 || searchParams.get('countryIso2');

  const {
    data: ranking,
    hasNextPage,
    fetchNextPage,
    isLoading,
  } = useInfiniteQuery<CityVisitRanking>({
    queryKey: ['city-visit-ranking', countryIso2, date, iso2, isPagination],
    queryFn: async ({ pageParam }) =>
      (
        await axios.get<CityVisitRanking>(`/cities/ranking/visit`, {
          params: {
            count,
            page: pageParam,
            countryIso2: iso2,
            date,
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
        <RankingTitle>{t('ranking.most-visited-cities')}</RankingTitle>
      </RankingHeader>
      <RankingContent>
        {isLoading && skeleton && <RankingSkeleton count={count} />}
        {ranking &&
          ranking.pages.map((page, pageIndex) =>
            page.map((city, index) => (
              <RankingItem
                key={city.id}
                ref={page.length - 1 === index ? ref : undefined}
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
                      className="w-[36px] rounded-sm"
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
                  <span className="font-bold">{city.totalVisit}</span>
                </div>
              </RankingItem>
            )),
          )}
        {ranking && ranking.pages[0].length === 0 && (
          <div className="py-4 text-sm text-center">
            <span>{t('ranking.empty')}</span>
          </div>
        )}
      </RankingContent>
      {seeMore && ranking?.pages[0].length !== 0 && (
        <RankingFooter>
          <Link
            className="text-right hover:underline text-sm font-bold w-full uppercase text-primary"
            href={{
              pathname: '/city/ranking/visits',
              query: {
                ...(iso2 && {
                  countryIso2: iso2,
                }),
              },
            }}
          >
            {t('ranking.more')}
          </Link>
        </RankingFooter>
      )}
    </Ranking>
  );
};
