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

export const CountryVisitRanking = ({
  count = 10,
  isPagination = false,
  seeMore = false,
  skeleton = true,
}) => {
  const t = useTranslations();
  const { ref, inView } = useInView();
  const searchParams = useSearchParams();

  const {
    data: ranking,
    hasNextPage,
    fetchNextPage,
    isLoading,
  } = useInfiniteQuery<CountryVisitRanking>({
    queryKey: ['country-visit-ranking', searchParams.get('date'), isPagination],
    queryFn: async ({ pageParam }) =>
      (
        await axios.get<CountryVisitRanking>(`/countries/ranking/visit`, {
          params: {
            page: pageParam,
            count,
            date: searchParams.get('date'),
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
        <RankingTitle>{t('ranking.most-visited-countries')}</RankingTitle>
      </RankingHeader>
      <RankingContent>
        {isLoading && skeleton && <RankingSkeleton count={25} />}
        {ranking &&
          ranking.pages.map((page, pageIndex) =>
            page.map((country, index) => (
              <RankingItem
                key={country.iso2}
                ref={page.length - 1 === index ? ref : undefined}
              >
                <div className="flex gap-2 items-center">
                  <h3 className="w-[24px] font-bold">
                    {pageIndex * count + (index + 1)}º
                  </h3>
                  <CountryFlag className="w-[36px] rounded-sm" iso2={country.iso2} />
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
                <Link
                  href={{
                    params: { slug: country.iso2 },
                    pathname: '/country/[slug]/visits',
                  }}
                  className="font-bold"
                >
                  {country.totalVisit}
                </Link>
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
            href={'/country/ranking/visits'}
          >
            {t('ranking.more')}
          </Link>
        </RankingFooter>
      )}
    </Ranking>
  );
};
