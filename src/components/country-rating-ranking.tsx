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
import { ChevronRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

interface CountryRatingRankingProps {
  count?: number;
  isPagination?: boolean;
  seeMore?: boolean;
  skeleton?: boolean;
  showTitle?: boolean;
}

export const CountryRatingRanking = ({
  count = 10,
  isPagination = false,
  seeMore = false,
  skeleton = true,
  showTitle = true,
}: CountryRatingRankingProps) => {
  const t = useTranslations();
  const { ref, inView } = useInView();
  const searchParams = useSearchParams();

  const {
    data: ranking,
    fetchNextPage,
    hasNextPage,
    isLoading,
  } = useInfiniteQuery<CountryRatingRanking>({
    queryKey: ['country-rating-ranking', searchParams.get('date'), isPagination],
    queryFn: async ({ pageParam }) =>
      (
        await axios.get<CountryRatingRanking>(`/countries/ranking/rating`, {
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
      {showTitle && (
        <RankingHeader>
          <RankingTitle>{t('ranking.top-rated-countries')}</RankingTitle>
        </RankingHeader>
      )}
      <RankingContent>
        {isLoading && skeleton && <RankingSkeleton count={count} />}
        {ranking &&
          ranking.pages.map((page, pageIndex) =>
            page.map((country, index) => (
              <RankingItem
                key={country.iso2}
                ref={page.length - 1 === index ? ref : undefined}
                className=""
              >
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
                <Link
                  href={{
                    params: { slug: country.iso2 },
                    pathname: '/country/[slug]/visits',
                  }}
                >
                  <div className="flex items-center gap-1">
                    <Rating
                      className="max-w-[72px] sm:max-w-[84px]"
                      value={country.averageRating}
                      readOnly
                    />
                    <span className="font-bold w-[24px] sm:w-[28px]">
                      {country.averageRating}
                    </span>
                  </div>
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
            href={'/country/ranking/rating'}
          >
            <div className="flex gap-0.5 items-center justify-end">
              <span>{t('ranking.more')}</span>
              <ChevronRight className="w-[24px]" />
            </div>
          </Link>
        </RankingFooter>
      )}
    </Ranking>
  );
};
