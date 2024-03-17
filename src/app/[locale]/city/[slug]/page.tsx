'use client';

import axios from '@/services/axios';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import React from 'react';
import { LazyMap, LazyMarker, LazyTileLayer } from '@/components/leaflet-map';
import { CityVisit } from '@/components/city-visit';
import { Carousel } from 'react-responsive-carousel';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/common/navigation';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { intlFormatDistance } from 'date-fns';
import { UserHoverCard } from '@/components/user-hovercard';

export default function Page({ params }: { params: { slug: string } }) {
  const t = useTranslations();
  const locale = useLocale();

  const city = useQuery<CityPage>({
    queryFn: async () => (await axios.get<CityPage>(`/cities/${params.slug}`)).data,
    queryKey: ['city', +params.slug],
  });

  const images = useQuery<CityImage[]>({
    queryFn: async () =>
      (await axios.get<CityImage[]>(`/cities/${params.slug}/images`)).data,
    queryKey: ['city-images', +params.slug],
  });

  const { data: visits } = useInfiniteQuery<CityVisit[]>({
    queryKey: ['city-visits', +params.slug],
    queryFn: async () =>
      (await axios.get<CityVisit[]>(`/city-visits/${params.slug}`)).data,
    initialPageParam: 1,
    getNextPageParam: (page, allPages) =>
      page.length === 10 ? allPages.length + 1 : null,
  });

  if (!images.data || !city.data || !visits) {
    return;
  }

  return (
    <div className="grid gap-x-4 gap-y-6 grid-cols-1 sm:grid-cols-2">
      <div>
        <div className="mb-2">
          <h2 className="font-bold text-xl border-b-2 border-primary pb-1">
            {t('country-city-page.gallery')}
          </h2>
        </div>
        <div className="border-2 rounded-lg aspect-square overflow-hidden">
          {images.data.length > 0 ? (
            <Carousel autoPlay emulateTouch showIndicators={false} showStatus={false}>
              {images.data.map((media) => (
                <div key={media.id} className="relative">
                  <Image
                    src={media.url}
                    alt=""
                    height={532}
                    width={532}
                    className="h-full aspect-square object-cover"
                  />
                  <div className="absolute h-1/3 bottom-0 left-0 w-full">
                    <div className="absolute w-full h-full bg-black gradient-mask-t-[rgba(0,0,0,1.0)]" />
                    <div className="flex h-full py-3 px-4 relative items-end">
                      <div className="flex w-full items-center text-sm justify-between">
                        <div className="flex items-center gap-2">
                          <Link
                            href={{
                              params: { slug: media.user.username },
                              pathname: '/[slug]',
                            }}
                          >
                            <UserHoverCard username={media.user.username}>
                              <Avatar>
                                <AvatarImage src={media.user.image} />
                              </Avatar>
                            </UserHoverCard>
                          </Link>
                          <UserHoverCard username={media.user.username}>
                            <Link
                              href={{
                                params: { slug: media.user.username },
                                pathname: '/[slug]',
                              }}
                            >
                              <div className="flex flex-col items-center">
                                <span>{media.user.fullName}</span>
                                <span>@{media.user.username}</span>
                              </div>
                            </Link>
                          </UserHoverCard>
                        </div>
                        <div>
                          {intlFormatDistance(media.createdAt, new Date(), {
                            numeric: 'always',
                            style: 'narrow',
                            locale,
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </Carousel>
          ) : (
            <div className="justify-center flex h-full w-full items-center">
              <span>{t('country-city-page.no-images')}</span>
            </div>
          )}
        </div>
      </div>
      <div>
        <div className="mb-2">
          <h2 className="font-bold text-xl border-b-2 border-primary pb-1">
            {t('country-city-page.location')}
          </h2>
        </div>
        <LazyMap
          center={[city.data.latitude, city.data.longitude]}
          zoom={8}
          className="w-full aspect-square rounded-lg border-2"
          scrollWheelZoom={false}
          dragging={false}
        >
          <LazyTileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
          />
          <LazyMarker position={[city.data.latitude, city.data.longitude]} />
        </LazyMap>
      </div>
      <div className="sm:col-span-2">
        <div>
          <div className="mb-2">
            <h2 className="font-bold text-xl border-b-2 border-primary pb-1">
              {t('country-city-page.reviews')}
            </h2>
          </div>
          <div>
            {visits.pages[0].length === 0 && (
              <div className="py-4 text-sm text-center">
                <span>{t('country-city-page.no-reviews')}</span>
              </div>
            )}
            {visits.pages[0].length !== 0 &&
              visits.pages[0]
                .slice(0, 5)
                .map((visit) => <CityVisit key={visit.id} visit={visit} />)}
          </div>
          {visits.pages[0].length !== 0 && (
            <div className="w-full text-right mt-1">
              <Link
                href={{ params: { slug: city.data.id }, pathname: '/city/[slug]/visits' }}
                className="text-primary text-sm font-bold uppercase hover:underline"
              >
                {t('country-city-page.view-more-reviews')}
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
