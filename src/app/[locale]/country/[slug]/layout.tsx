'use client';

import { Link, usePathname } from '@/common/navigation';
import { CountryFlag } from '@/components/ui/country-flag';
import { cn } from '@/lib/utils';
import axios from '@/services/axios';
import { Rating } from '@smastrom/react-rating';
import { useQuery } from '@tanstack/react-query';
import { MapPin, CheckCircle } from 'lucide-react';
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
    <div className="px-4 pb-4 relative">
      <CountryFlag
        className="w-full left-0 right-0 m-auto absolute -z-10 gradient-mask-b-[rgba(0,0,0,1.0)_4px] rounded-none"
        iso2={country.data.iso2}
      />
      <div className="pt-[160px] sm:pt-[400px] justify-between pb-[28px] sm:pb-[40px]">
        <div>
          <h2 className="font-bold text-3xl sm:text-5xl">{country.data.name}</h2>
          <div className="flex items-center gap-2 text-muted-foreground">
            <div>
              <Rating
                value={country.data.averageRating || 0}
                readOnly
                className="max-w-[120px] sm:max-w-[144px]"
              />
            </div>
            <span>{country.data.averageRating}</span>
            <div className="text-sm flex gap-2 items-center">
              <div className="flex items-center gap-0.5">
                <MapPin className="w-[18px] text-blue-400" />
                <span>{country.data.visitsCount}</span>
              </div>
              <div className="flex items-center gap-0.5">
                <CheckCircle className="w-[18px] text-green-400" />
                <span>{country.data.interestsCount}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex gap-4 text-sm text-primary mb-[24px]">
        <Link
          className={cn(
            pathname === '/country/[slug]' && 'font-bold border-b-2 border-blue-600',
            'py-2 flex justify-center',
          )}
          href={{ pathname: '/country/[slug]', params: { slug: params.slug } }}
        >
          {t('country-city-page.tabs.overview')}
        </Link>
        <Link
          className={cn(
            pathname === '/country/[slug]/visits' &&
              'font-bold border-b-2 border-blue-600',
            'py-2 flex justify-center',
          )}
          href={{ pathname: '/country/[slug]/visits', params: { slug: params.slug } }}
        >
          {t('country-city-page.tabs.reviews')}
        </Link>
        <Link
          className={cn(
            // pathname === '/co' && 'font-bold border-b-2 border-blue-600',
            'py-2 flex justify-center',
          )}
          href={{
            pathname: '/city/ranking/rating',
            query: {
              countryIso2: params.slug,
            },
          }}
        >
          {t('country-city-page.tabs.ranking')}
        </Link>
      </div>
      {children}
    </div>
  );
}
