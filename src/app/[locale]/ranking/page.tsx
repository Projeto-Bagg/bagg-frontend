'use client';

import React from 'react';
import { CountryRatingRanking } from '@/components/ranking/country-rating-ranking';
import { CityRatingRanking } from '@/components/ranking/city-rating-ranking';
import { CountryVisitRanking } from '@/components/ranking/country-visit-ranking';
import { CityVisitRanking } from '@/components/ranking/city-visit-ranking';
import { useQuery } from '@tanstack/react-query';
import axios from '@/services/axios';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { CountryFlag } from '@/components/ui/country-flag';
import { useTranslations } from 'next-intl';

export default function Page() {
  const t = useTranslations();

  const { data: trending } = useQuery<TrendingCity[]>({
    queryKey: ['trending'],
    queryFn: async () => (await axios.get<TrendingCity[]>('/cities/trending')).data,
  });

  if (!trending) {
    return;
  }

  return (
    <div className="p-4">
      <Carousel className="mb-4 w-full">
        <CarouselContent>
          {trending.map((city) => (
            <CarouselItem className="basis-1/2 sm:basis-1/4" key={city.id}>
              <div className="border h-full overflow-hidden aspect-[12/9] rounded-lg text-sm">
                <CountryFlag
                  className="w-full h-1/2 border-none aspect-auto bg-cover bg-center rounded-none"
                  iso2={city.region.country.iso2}
                />
                <div className="p-2 h-1/2 flex flex-col justify-between">
                  <div className="flex justify-between">
                    <span>{city.name}</span>
                    <span>{city.percentFromTotal}%</span>
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
