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
import { Rating } from '@smastrom/react-rating';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

interface CityRatingRankingProps {
  count?: number;
  isPagination?: boolean;
  seeMore?: boolean;
  countryIso2?: string;
  skeleton?: boolean;
}

export const CityRatingRanking = ({
  count = 10,
  isPagination = false,
  seeMore,
  countryIso2,
  skeleton = true,
}: CityRatingRankingProps) => {
  const t = useTranslations();
  const { ref, inView } = useInView();
  const searchParams = useSearchParams();
  const date = searchParams.get('date');
  const iso2 = countryIso2 || searchParams.get('countryIso2');

  const {
    data: ranking,
    fetchNextPage,
    hasNextPage,
    isLoading,
  } = useInfiniteQuery<CityRatingRanking>({
    queryKey: ['city-rating-ranking', countryIso2, date, iso2, isPagination],
    queryFn: async ({ pageParam }) =>
      (
        await axios.get<CityRatingRanking>(`/cities/ranking/rating`, {
          params: {
            page: pageParam,
            count,
            countryIso2: iso2,
            date: date,
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
        <RankingTitle>{t('ranking.top-rated-cities')}</RankingTitle>
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
                      className="w-[36px]"
                      iso2={city.iso2}
                      tooltip={city.country}
                    />
                  </Link>
                  <div className="w-[174px] whitespace-nowrap overflow-hidden text-ellipsis">
                    <Link
                      className="hover:underline mr-1"
                      href={{ params: { slug: city.id }, pathname: '/city/[slug]' }}
                    >
                      <span>{city.name}</span>
                    </Link>
                    <span className="text-muted-foreground">{city.region}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Rating className="max-w-[92px]" value={city.averageRating} readOnly />
                  <span className="font-bold w-[28px]">{city.averageRating}</span>
                </div>
              </RankingItem>
            )),
          )}
      </RankingContent>
      {seeMore && (
        <RankingFooter>
          <Link
            className="text-right hover:underline text-sm font-bold w-full uppercase text-primary"
            href={{
              pathname: '/city/ranking/rating',
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