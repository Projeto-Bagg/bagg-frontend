'use client';

import { Link } from '@/common/navigation';
import { LazyMap, LazyMarker, LazyTileLayer } from '@/components/leaflet-map';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { CountryFlag } from '@/components/ui/country-flag';
import { UserHoverCard } from '@/components/user-hovercard';
import axios from '@/services/axios';
import { Rating } from '@smastrom/react-rating';
import { useQuery } from '@tanstack/react-query';
import { intlFormatDistance } from 'date-fns';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import React from 'react';
import { Carousel } from 'react-responsive-carousel';

export default function Page({ params }: { params: { slug: string } }) {
  const t = useTranslations();
  const locale = useLocale();

  const country = useQuery<CountryPage>({
    queryFn: async () => (await axios.get<CountryPage>('/countries/' + params.slug)).data,
    queryKey: ['country', params.slug],
  });

  const images = useQuery<CountryImage[]>({
    queryFn: async () =>
      (await axios.get<CountryImage[]>(`/countries/${params.slug}/images`)).data,
    queryKey: ['country-images', params.slug],
  });

  const cityRatingRanking = useQuery<CityRatingRanking>({
    queryFn: async () =>
      (
        await axios.get<CityRatingRanking>(
          `/cities/ranking/rating?page=1&count=10&countryIso2=${params.slug}`,
        )
      ).data,
    queryKey: ['city-interests', params.slug],
  });

  const cityVisitRanking = useQuery<CityVisitRanking>({
    queryFn: async () =>
      (
        await axios.get<CityVisitRanking>(
          `/cities/ranking/visit?page=1&count=10&countryIso2=${params.slug}`,
        )
      ).data,
    queryKey: ['city-visits', params.slug],
  });

  if (!country.data || !images.data) {
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
            <Carousel emulateTouch showIndicators={false} showStatus={false}>
              {images.data.map((media) => (
                <div key={media.id} className="relative">
                  <Image
                    src={media.url}
                    alt=""
                    height={532}
                    width={532}
                    className="h-full aspect-square object-cover"
                  />
                  <div className="absolute h-1/2 bottom-0 left-0 w-full">
                    <div className="absolute w-full h-full bg-black gradient-mask-t-[rgba(0,0,0,1.0)]" />
                    <div className="flex h-full py-3 px-4 relative items-end">
                      <div className="flex w-full items-center text-sm justify-between">
                        <div className="flex items-center gap-2">
                          <UserHoverCard username={media.user.username}>
                            <Link
                              href={{
                                params: { slug: media.user.username },
                                pathname: '/[slug]',
                              }}
                            >
                              <Avatar>
                                <AvatarImage src={media.user.image} />
                              </Avatar>
                            </Link>
                          </UserHoverCard>
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
                        <div className="flex items-center gap-1">
                          <Link
                            className="hover:underline text-primary"
                            href={{
                              params: { slug: media.city.id },
                              pathname: '/city/[slug]',
                            }}
                          >
                            {media.city.name}
                          </Link>
                          {'·'}
                          <span>
                            {intlFormatDistance(media.createdAt, new Date(), {
                              numeric: 'always',
                              style: 'narrow',
                              locale,
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </Carousel>
          ) : (
            <div className="justify-center flex h-full w-full items-center font-bold">
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
          center={[country.data.latitude, country.data.longitude]}
          zoom={3}
          className="w-full aspect-square rounded-lg border-2"
          scrollWheelZoom={false}
          dragging={false}
        >
          <LazyTileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
          />
          <LazyMarker position={[country.data.latitude, country.data.longitude]} />
        </LazyMap>
      </div>
      <div>
        <div className="mb-2">
          <h2 className="font-bold text-xl border-b-2 border-primary pb-1">
            {t('ranking.top-rated-cities')}
          </h2>
        </div>
        <div>
          <ul className="divide-y-2 min-h-[440px]">
            {cityRatingRanking.data &&
              cityRatingRanking.data.map((city) => (
                <li
                  key={city.id}
                  className="flex items-center h-[44px] p-3 justify-between"
                >
                  <div className="flex gap-2 items-center">
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
                    <div className="flex gap-1">
                      <Link
                        className="hover:underline shrink-0"
                        href={{ params: { slug: city.id }, pathname: '/city/[slug]' }}
                      >
                        <span>{city.name}</span>
                      </Link>
                      <span className="text-muted-foreground text-ellipsis w-fit overflow-hidden whitespace-nowrap">
                        {city.region}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Rating
                      className="max-w-[92px]"
                      value={city.averageRating}
                      readOnly
                    />
                    <span className="font-bold">{city.averageRating}</span>
                  </div>
                </li>
              ))}
          </ul>
        </div>
      </div>
      <div>
        <div className="mb-2">
          <h2 className="font-bold text-xl border-b-2 border-primary pb-1">
            {t('ranking.most-visited-cities')}
          </h2>
        </div>
        <ul className="divide-y-2 min-h-[440px]">
          {cityVisitRanking.data &&
            cityVisitRanking.data.map((city, index) => (
              <li key={index} className="flex items-center h-[44px] p-3 justify-between">
                <div className="flex gap-2 items-center">
                  <Link
                    href={{
                      params: { slug: city.region.country.iso2 },
                      pathname: '/country/[slug]',
                    }}
                  >
                    <CountryFlag
                      className="w-[36px] rounded-sm"
                      iso2={city.region.country.iso2}
                      tooltip={city.region.country.name}
                    />
                  </Link>
                  <div className="flex gap-1">
                    <Link
                      className="hover:underline"
                      href={{ params: { slug: city.id }, pathname: '/city/[slug]' }}
                    >
                      <span>{city.name}</span>
                    </Link>
                    <span className="text-muted-foreground">{city.region.name}</span>
                  </div>
                </div>
                <div>
                  <span>{city.totalVisit}</span>
                </div>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}
