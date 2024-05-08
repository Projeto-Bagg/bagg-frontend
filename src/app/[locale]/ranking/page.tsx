'use client';

import React from 'react';
import { CountryRatingRanking } from '@/components/ranking/country-rating-ranking';
import { CityRatingRanking } from '@/components/ranking/city-rating-ranking';
import { CountryVisitRanking } from '@/components/ranking/country-visit-ranking';
import { CityVisitRanking } from '@/components/ranking/city-visit-ranking';
import { useQuery } from '@tanstack/react-query';
import axios from '@/services/axios';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { CountryFlag } from '@/components/ui/country-flag';
import { useTranslations } from 'next-intl';
import { Link } from '@/common/navigation';
import Autoplay from 'embla-carousel-autoplay';

export default function Page() {
  const t = useTranslations();

  const { data: trending } = useQuery<{ totalInterest: number; cities: TrendingCity[] }>({
    queryKey: ['trending'],
    queryFn: async () =>
      (
        await axios.get<{ totalInterest: number; cities: TrendingCity[] }>(
          '/cities/trending',
        )
      ).data,
  });

  if (!trending) {
    return;
  }

  return (
    <div className="p-4">
      <div className="mb-2">
        <h2 className="font-bold w-fit text-xl sm:text-2xl border-b-2 border-primary pb-1">
          Ranking
        </h2>
      </div>
      <div className="mb-2">
        <h2 className="font-bold w-full text-xl border-b-2 border-primary pb-1">
          {t('ranking.trending.title')}
        </h2>
      </div>
      <div className="text-sm text-muted-foreground flex justify-between mb-2">
        <span>{t('ranking.trending.description')}</span>
        <span className="text-sm font-normal">Total: {trending.totalInterest}</span>
      </div>
      <Carousel
        plugins={[
          Autoplay({
            delay: 3500,
            stopOnLastSnap: true,
          }),
        ]}
        className="mb-4 w-full"
      >
        <CarouselContent>
          {trending.cities.map((city) => (
            <CarouselItem className="basis-[45%] sm:basis-1/4" key={city.id}>
              <div className="border relative h-full overflow-hidden aspect-[12/9] rounded-lg text-sm">
                <CountryFlag
                  className="w-full h-full absolute gradient-mask-b-[rgba(0,0,0,1.0)_4px] -z-10 border-none aspect-auto bg-cover bg-center rounded-none"
                  iso2={city.region.country.iso2}
                />
                <div className="p-2 h-full  flex flex-col justify-end">
                  <div>
                    <div className="flex justify-between min-w-0 w-full">
                      <div className="flex-1 whitespace-nowrap overflow-hidden text-ellipsis">
                        <Link
                          className="hover:underline"
                          href={{ params: { slug: city.id }, pathname: '/city/[slug]' }}
                        >
                          <span>{city.name}</span>
                        </Link>
                      </div>
                      <span>{city.percentFromTotal}%</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {city.region.name}
                    </span>
                  </div>
                  {city.variationPercentage && (
                    <div className="text-xs text-muted-foreground">
                      {city.variationPercentage >= 0 ? '+' : ''}
                      {t('ranking.trending.variation', {
                        count: city.variationPercentage,
                      })}
                    </div>
                  )}
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
      <div className="grid w-full grid-cols-1 sm:grid-cols-2 gap-4">
        <CountryRatingRanking seeMore skeleton />
        <CountryVisitRanking seeMore skeleton />
        <CityRatingRanking seeMore skeleton />
        <CityVisitRanking seeMore skeleton />
      </div>
    </div>
  );
}
