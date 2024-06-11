'use client';

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
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

export const TrendingCities = () => {
  const t = useTranslations();
  const { data: trending, isLoading } = useQuery<{
    totalInterest: number;
    cities: TrendingCity[];
  }>({
    queryKey: ['trending'],
    queryFn: async () =>
      (
        await axios.get<{ totalInterest: number; cities: TrendingCity[] }>(
          '/cities/trending',
        )
      ).data,
  });

  return (
    <div>
      <div className="mb-2">
        <h2 className="font-bold w-full text-base sm:text-xl border-b-2 border-primary pb-1">
          {t('ranking.trending.title')}
        </h2>
      </div>
      <div className="text-sm text-muted-foreground flex justify-between mb-2">
        <span>{t('ranking.trending.description')}</span>
        <span className="text-sm font-normal">Total: {trending?.totalInterest}</span>
      </div>
      {isLoading && <TrendingCitiesSkeleton />}
      {trending && (
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
              <CarouselItem
                className="basis-[45%] font-semibold sm:basis-1/4"
                key={city.id}
              >
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
                            {city.name}
                          </Link>
                        </div>
                        <span>{city.percentFromTotal}%</span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {city.region.name}
                      </span>
                    </div>
                    {city.variationPercentage?.toString() && (
                      <div className="text-xs text-muted-foreground">
                        <span
                          className={cn(
                            city.variation === 0
                              ? 'text-yellow-400'
                              : city.variation > 0
                              ? 'text-green-500'
                              : 'text-red-500',
                          )}
                        >
                          {city.variationPercentage >= 0 ? '+' : ''}
                          {city.variationPercentage}%
                        </span>{' '}
                        {t('ranking.trending.variation')}
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
      )}
    </div>
  );
};

const TrendingCitiesSkeleton = () => {
  return (
    <div className="flex mb-4 -ml-1 overflow-hidden">
      {[...Array(4)].map((_, index) => (
        <div
          className="basis-[45%] min-w-0 shrink-0 grow-0 pl-1 sm:basis-1/4 h-full"
          key={index}
        >
          <div className="w-full h-full border aspect-[12/9]">
            <Skeleton className="w-full h-full gradient-mask-b-[rgba(0,0,0,1.0)_4px]" />
          </div>
        </div>
      ))}
    </div>
  );
};
