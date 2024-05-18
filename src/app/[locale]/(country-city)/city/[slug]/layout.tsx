'use client';

import React, { ReactNode } from 'react';
import { Link, usePathname, useRouter } from '@/common/navigation';
import { CreateCityVisit } from '@/app/[locale]/(country-city)/city/[slug]/components/create-city-visit';
import { CountryFlag } from '@/components/ui/country-flag';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/auth-context';
import { useCreateCityInterest } from '@/hooks/useCreateCityInterest';
import { useCreateCityVisit } from '@/hooks/useCreateCityVisit';
import { useDeleteCityInterest } from '@/hooks/useDeleteCityInterest';
import { useDeleteCityVisit } from '@/hooks/useDeleteCityVisit';
import { useUpdateCityVisit } from '@/hooks/useUpdateCityVisit';
import { cn } from '@/lib/utils';
import axios from '@/services/axios';
import { Rating } from '@smastrom/react-rating';
import { useQuery } from '@tanstack/react-query';
import { MapPin, CheckCircle, Home } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function Layout({
  params,
  children,
}: {
  params: { slug: string };
  children: ReactNode;
}) {
  const createCityInterest = useCreateCityInterest();
  const deleteCityInterest = useDeleteCityInterest();
  const createCityVisit = useCreateCityVisit();
  const updateCityVisit = useUpdateCityVisit();
  const deleteCityVisit = useDeleteCityVisit();
  const t = useTranslations();
  const pathname = usePathname();
  const auth = useAuth();
  const router = useRouter();

  const city = useQuery<CityPage>({
    queryFn: async () => (await axios.get<CityPage>('/cities/' + params.slug)).data,
    queryKey: ['city', +params.slug],
  });

  if (!city.data) {
    return;
  }

  const checkInterest = () => {
    if (!auth.user) {
      return router.push({ pathname: '/login' });
    }

    if (city.data.isInterested) {
      return deleteCityInterest.mutateAsync(city.data.id);
    }

    createCityInterest.mutateAsync(city.data.id);
  };

  const checkVisit = async () => {
    if (!auth.user) {
      return router.push({ pathname: '/login' });
    }

    if (city.data.userVisit?.message) {
      return toast({
        variant: 'destructive',
        duration: 1000 * 10,
        title: t('country-city-page.uncheck-visit-with-review-toast.title'),
        description: t('country-city-page.uncheck-visit-with-review-toast.description'),
      });
    }

    if (city.data.userVisit) {
      await deleteCityVisit.mutateAsync({ cityId: city.data.id });
      return;
    }

    await createCityVisit.mutateAsync({ cityId: city.data.id });
  };

  const onRate = async (value: number) => {
    if (!auth.user) {
      return router.push({ pathname: '/login' });
    }

    if (city.data.userVisit) {
      await updateCityVisit.mutateAsync({ rating: value, cityId: city.data.id });
      return;
    }

    await createCityVisit.mutateAsync({ rating: value, cityId: city.data.id });
  };

  return (
    <div className="px-4 container pb-4 relative">
      <CountryFlag
        className="w-full left-0 right-0 m-auto absolute -z-10 gradient-mask-b-[rgba(0,0,0,1.0)_4px] rounded-none"
        iso2={city.data.region.country.iso2}
      />
      <div className="flex flex-col gap-6 sm:flex-row pt-[160px] sm:pt-[400px] justify-between pb-[24px]">
        <div>
          <h2 className="font-bold text-3xl sm:text-5xl">{city.data.name}</h2>
          <div className="font-bold text-lg sm:text-2xl text-muted-foreground">
            <span>
              {city.data.region.name}
              {', '}
            </span>
            <Link
              className="hover:underline"
              href={{
                params: { slug: city.data.region.country.iso2 },
                pathname: '/country/[slug]',
              }}
            >
              {city.data.region.country.name}
            </Link>
          </div>
          <div className="flex text-sm items-end gap-2 text-muted-foreground">
            <Tooltip>
              <TooltipTrigger>
                <Link
                  href={{
                    params: { slug: params.slug },
                    pathname: '/city/[slug]/visits',
                  }}
                >
                  <div className="flex items-end gap-1">
                    <Rating
                      value={city.data.averageRating || 0}
                      readOnly
                      className="max-w-[120px] sm:max-w-[144px]"
                    />
                    <span className="h-[22px]">{city.data.averageRating || 0}</span>
                  </div>
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                {t('country-city-page.data.rating.tooltip', {
                  rating: city.data.averageRating || 0,
                  count: city.data.reviewsCount,
                })}
              </TooltipContent>
            </Tooltip>
            <div className="flex gap-2 items-center">
              <Tooltip>
                <TooltipTrigger>
                  <div className="flex items-center gap-0.5">
                    <MapPin className="w-[18px] text-blue-400" />
                    <span>{city.data.visitsCount}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  {t('country-city-page.data.visits.tooltip', {
                    count: city.data.visitsCount,
                  })}
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger>
                  <div className="flex items-center gap-0.5">
                    <CheckCircle className="w-[18px] text-green-400" />
                    <span>{city.data.interestsCount}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  {t('country-city-page.data.interest.tooltip', {
                    count: city.data.interestsCount,
                  })}
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger>
                  <Link
                    href={{
                      params: { slug: params.slug },
                      pathname: '/city/[slug]/residents',
                    }}
                  >
                    <div className="flex items-center gap-0.5">
                      <Home className="w-[18px] text-orange-400" />
                      <span>{city.data.residentsCount}</span>
                    </div>
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  {t('country-city-page.data.resident.tooltip', {
                    count: city.data.residentsCount,
                  })}
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
          <div className="flex sm:mt-2 gap-4 text-sm text-muted-foreground font-bold">
            <Link
              className={cn(
                pathname === '/city/[slug]'
                  ? 'border-b-2 border-blue-600 text-primary'
                  : 'hover:text-foreground transition-all duration-75',
                'py-2 flex justify-center',
              )}
              href={{ pathname: '/city/[slug]', params: { slug: params.slug } }}
            >
              {t('country-city-page.tabs.overview')}
            </Link>
            <Link
              className={cn(
                pathname === '/city/[slug]/visits'
                  ? 'border-b-2 border-blue-600 text-primary'
                  : 'hover:text-foreground transition-all duration-75',
                'py-2 flex justify-center',
              )}
              href={{ pathname: '/city/[slug]/visits', params: { slug: params.slug } }}
            >
              {t('country-city-page.tabs.reviews.label')}
            </Link>
            <Link
              className={cn(
                pathname === '/city/[slug]/gallery'
                  ? 'border-b-2 border-blue-600 text-primary'
                  : 'hover:text-foreground transition-all duration-75',
                'py-2 flex justify-center',
              )}
              href={{ pathname: '/city/[slug]/gallery', params: { slug: params.slug } }}
            >
              {t('country-city-page.tabs.gallery.label')}
            </Link>
            <Link
              className={cn(
                pathname === '/city/[slug]/residents'
                  ? 'border-b-2 border-blue-600 text-primary'
                  : 'hover:text-foreground transition-all duration-75',
                'py-2 flex justify-center',
              )}
              href={{ pathname: '/city/[slug]/residents', params: { slug: params.slug } }}
            >
              {t('country-city-page.tabs.residents.label')}
            </Link>
          </div>
        </div>
        <div className="flex shadow shrink-0 flex-col font-semibold text-sm bg-accent rounded-lg w-full sm:w-[200px] space-y-1 divide-y-2 divide-background">
          <div className="flex justify-center gap-4 py-3">
            <button
              id="check-visit"
              onClick={checkVisit}
              className="flex flex-col gap-1 items-center"
            >
              <MapPin
                strokeWidth={2.5}
                className={cn(
                  'w-[24px] h-[24px]',
                  city.data.userVisit && 'text-blue-400',
                )}
              />
              <span>{t('country-city-page.visited')}</span>
            </button>
            <button
              id="check-interest"
              className="flex flex-col gap-1 items-center"
              onClick={checkInterest}
            >
              <CheckCircle
                className={cn(
                  'w-[24px] h-[24px]',
                  city.data.isInterested && 'text-green-400',
                )}
                strokeWidth={2.5}
              />
              <span>
                {city.data.isInterested
                  ? t('country-city-page.interested')
                  : t('country-city-page.interest')}
              </span>
            </button>
          </div>
          <div className="flex flex-col items-center py-3">
            <span>{t('country-city-page.rate')}</span>
            <Rating
              className="max-w-[120px]"
              value={
                city.data.userVisit
                  ? city.data.userVisit.rating
                    ? city.data.userVisit.rating
                    : 0
                  : 0
              }
              onChange={onRate}
            />
          </div>
          <CreateCityVisit city={city.data}>
            <div className="flex justify-center py-3">
              <span>{t('country-city-page.review')}</span>
            </div>
          </CreateCityVisit>
        </div>
      </div>
      {children}
    </div>
  );
}
