'use client';

import { Link, usePathname } from '@/common/navigation';
import { CountryFlag } from '@/components/ui/country-flag';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import axios from '@/services/axios';
import { Rating } from '@smastrom/react-rating';
import { useQuery } from '@tanstack/react-query';
import { MapPin, CheckCircle, Home } from 'lucide-react';
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
      <div className="pt-[160px] sm:pt-[400px] justify-between pb-[28px] sm:pb-[40px]">
        <div>
          <div className="flex gap-2 items-baseline">
            <h2 className="font-bold text-3xl sm:text-5xl">{country.data.name}</h2>
            <div className="flex gap-1 shrink-0 items-baseline">
              {country.data.positionInRatingRanking && (
                <Tooltip>
                  <TooltipTrigger>
                    <Link
                      className="hover:underline"
                      href={{ pathname: '/ranking/country/rating' }}
                    >
                      <div className="flex gap-0.5 items-end">
                        <Rating value={1} items={1} className="h-5 w-5 sm:w-6 sm:h-6" />
                        <span>#{country.data.positionInRatingRanking}</span>
                      </div>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    {t(
                      'country-city-page.ranking.country.position-in-rating-ranking-tooltip',
                    )}
                  </TooltipContent>
                </Tooltip>
              )}
              {country.data.positionInVisitRanking && (
                <Tooltip>
                  <TooltipTrigger>
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
                    {t(
                      'country-city-page.ranking.country.position-in-visit-ranking-tooltip',
                    )}
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
          </div>
          <div className="flex text-sm items-end gap-2 text-muted-foreground">
            <Tooltip>
              <TooltipTrigger>
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
                <TooltipTrigger>
                  {' '}
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
        </div>
      </div>
      <div className="flex gap-4 font-bold text-sm text-muted-foreground mb-[24px]">
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
          href={{ pathname: '/country/[slug]/gallery', params: { slug: params.slug } }}
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
          href={{ pathname: '/country/[slug]/residents', params: { slug: params.slug } }}
        >
          {t('country-city-page.tabs.residents.label')}
        </Link>
      </div>
      {children}
    </div>
  );
}
