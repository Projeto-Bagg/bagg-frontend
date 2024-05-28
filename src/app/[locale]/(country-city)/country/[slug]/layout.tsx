'use client';

import { Link, usePathname } from '@/common/navigation';
import { CountryFlag } from '@/components/ui/country-flag';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import axios from '@/services/axios';
import { Rating } from '@smastrom/react-rating';
import { useQuery } from '@tanstack/react-query';
import { MapPin, CheckCircle, Home, ChevronRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import React, { ReactNode } from 'react';

export default function Layout({
  params,
  children,
}: {
  params: { slug: string };
  children: ReactNode;
}) {
  const pathname = usePathname();
  const t = useTranslations();
  const country = useQuery<CountryPage>({
    queryFn: async () => (await axios.get<CountryPage>('/countries/' + params.slug)).data,
    queryKey: ['country', params.slug],
  });

  if (!country.data) {
    return;
  }

  return (
    <div className="px-4 container pb-4 relative">
      <CountryFlag
        className="w-full left-0 right-0 m-auto absolute -z-10 gradient-mask-b-[rgba(0,0,0,1.0)_4px] rounded-none"
        iso2={country.data.iso2}
      />
      <div className="pb-[24px]">
        <div className="h-[calc(((100vw*3)/4)-32px)] sm:h-[calc(((820px*3)/4)-32px)] flex flex-col justify-end">
          <div className="flex gap-2 items-baseline">
            <h2 className="font-bold text-3xl sm:text-5xl">{country.data.name}</h2>
            <div className="hidden sm:flex gap-1 shrink-0 items-baseline">
              {country.data.positionInRatingRanking && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      className="hover:underline"
                      href={{ pathname: '/ranking/country/rating' }}
                    >
                      <div className="flex gap-0.5 items-end">
                        <Rating
                          readOnly
                          value={1}
                          items={1}
                          className="max-h-5 max-w-5 sm:max-w-6 sm:max-h-6"
                        />
                        <span>#{country.data.positionInRatingRanking}</span>
                      </div>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    {t('country-city-page.ranking.position-in-rating-ranking-tooltip')}
                  </TooltipContent>
                </Tooltip>
              )}
              {country.data.positionInVisitRanking && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      className="hover:underline"
                      href={{ pathname: '/ranking/country/visits' }}
                    >
                      <div className="flex gap-0.5 items-end">
                        <MapPin
                          strokeWidth={2.5}
                          className={cn('h-5 w-5 sm:w-6 sm:h-6 text-blue-400')}
                        />
                        <span>#{country.data.positionInVisitRanking}</span>
                      </div>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    {t('country-city-page.ranking.position-in-visit-ranking-tooltip')}
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
          </div>
          <div className="flex text-sm items-end gap-2 text-muted-foreground font-bold">
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href={{
                    params: { slug: params.slug },
                    pathname: '/country/[slug]/visits',
                  }}
                >
                  <div className="flex items-end gap-1">
                    <Rating
                      value={country.data.averageRating || 0}
                      readOnly
                      className="max-w-[120px] sm:max-w-[144px]"
                    />
                    <span>{country.data.averageRating}</span>
                  </div>
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                {t('country-city-page.data.rating.tooltip', {
                  rating: country.data.averageRating || 0,
                  count: country.data.reviewsCount,
                })}
              </TooltipContent>
            </Tooltip>

            <div className="flex gap-2 items-center">
              <Tooltip>
                <TooltipTrigger>
                  <div className="flex items-center gap-0.5">
                    <MapPin className="w-[18px] h-[18px] text-blue-400" />
                    <span>{country.data.visitsCount}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  {t('country-city-page.data.visits.tooltip', {
                    count: country.data.visitsCount,
                  })}
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger>
                  <div className="flex items-center gap-0.5">
                    <CheckCircle className="w-[18px] h-[18px] text-green-400" />
                    <span>{country.data.interestsCount}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  {t('country-city-page.data.interest.tooltip', {
                    count: country.data.interestsCount,
                  })}
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href={{
                      params: { slug: params.slug },
                      pathname: '/country/[slug]/residents',
                    }}
                  >
                    <div className="flex items-center gap-0.5">
                      <Home className="w-[18px] h-[18px] text-orange-400" />
                      <span>{country.data.residentsCount}</span>
                    </div>
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  {t('country-city-page.data.resident.tooltip', {
                    count: country.data.residentsCount,
                  })}
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
          <div className="block sm:hidden text-muted-foreground font-semibold mt-1">
            <Link href={'/ranking/country/rating'}>
              <div className="flex justify-between">
                <span>
                  <span className="text-primary">
                    #{country.data.positionInRatingRanking}
                  </span>{' '}
                  {t('country-city-page.ranking.position-in-rating-ranking-tooltip')
                    .split(' ')
                    .filter((_, index) => index !== 0)
                    .join(' ')}
                </span>
                <ChevronRight strokeWidth={2.5} className="h-5" />
              </div>
            </Link>
            <Link href={'/ranking/country/visits'}>
              <div className="flex justify-between">
                <span>
                  <span className="text-primary">
                    #{country.data.positionInVisitRanking}
                  </span>{' '}
                  {t('country-city-page.ranking.position-in-visit-ranking-tooltip')
                    .split(' ')
                    .filter((_, index) => index !== 0)
                    .join(' ')}
                </span>
                <ChevronRight strokeWidth={2.5} className="h-5" />
              </div>
            </Link>
          </div>
          <div className="flex sm:mt-2 gap-4 font-bold text-sm text-muted-foreground">
            <Link
              className={cn(
                pathname === '/country/[slug]'
                  ? 'border-b-2 border-blue-600 text-primary'
                  : 'hover:text-foreground transition-all duration-75',
                'py-2 flex justify-center',
              )}
              href={{ pathname: '/country/[slug]', params: { slug: params.slug } }}
            >
              {t('country-city-page.tabs.overview')}
            </Link>
            <Link
              className={cn(
                pathname === '/country/[slug]/visits'
                  ? 'border-b-2 border-blue-600 text-primary'
                  : 'hover:text-foreground transition-all duration-75',
                'py-2 flex justify-center',
              )}
              href={{ pathname: '/country/[slug]/visits', params: { slug: params.slug } }}
            >
              {t('country-city-page.tabs.reviews.label')}
            </Link>
            <Link
              className={cn(
                pathname === '/country/[slug]/gallery'
                  ? 'border-b-2 border-blue-600 text-primary'
                  : 'hover:text-foreground transition-all duration-75',
                'py-2 flex justify-center',
              )}
              href={{
                pathname: '/country/[slug]/gallery',
                params: { slug: params.slug },
              }}
            >
              {t('country-city-page.tabs.gallery.label')}
            </Link>
            <Link
              className={cn(
                pathname === '/country/[slug]/residents'
                  ? 'border-b-2 border-blue-600 text-primary'
                  : 'hover:text-foreground transition-all duration-75',
                'py-2 flex justify-center',
              )}
              href={{
                pathname: '/country/[slug]/residents',
                params: { slug: params.slug },
              }}
            >
              {t('country-city-page.tabs.residents.label')}
            </Link>
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}
