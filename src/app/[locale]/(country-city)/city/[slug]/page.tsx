'use client';

import axios from '@/services/axios';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import React from 'react';
import { LazyMap, LazyMarker, LazyTileLayer } from '@/components/leaflet-map';
import { CityVisit } from '@/components/city-visit';
import { useTranslations } from 'next-intl';
import { GalleryImage } from '@/app/[locale]/(country-city)/gallery-image';
import { GalleryCarousel } from '@/app/[locale]/(country-city)/gallery-carousel';
import Autoplay from 'embla-carousel-autoplay';
import { CarouselItem } from '@/components/ui/carousel';
import { SeeMore } from '@/components/see-more';
import {
  Ranking,
  RankingContent,
  RankingHeader,
  RankingItem,
  RankingSkeleton,
  RankingTitle,
} from '@/components/ui/ranking';
import { Link } from '@/common/navigation';
import { Resident } from '@/app/[locale]/(country-city)/resident';
import { CountryFlag } from '@/components/ui/country-flag';

export default function Page({ params }: { params: { slug: string } }) {
  const t = useTranslations();

  const city = useQuery<CityPage>({
    queryFn: async () => (await axios.get<CityPage>(`/cities/${params.slug}`)).data,
    queryKey: ['city', +params.slug],
  });

  const { data: images } = useInfiniteQuery<CountryCityImage[]>({
    queryFn: async () =>
      (await axios.get<CountryCityImage[]>(`/cities/${params.slug}/images`)).data,
    queryKey: ['city-images', +params.slug],
    initialPageParam: 1,
    getNextPageParam: () => null,
  });

  const { data: visits } = useInfiniteQuery<CityVisit[]>({
    queryKey: ['city-visits', +params.slug],
    queryFn: async () =>
      (await axios.get<CityVisit[]>(`/city-visits/${params.slug}`)).data,
    initialPageParam: 1,
    getNextPageParam: () => null,
  });

  const closest = useInfiniteQuery<(City & { distance: number })[]>({
    queryKey: ['closest-cities', +params.slug],
    queryFn: async () =>
      (
        await axios.get<(City & { distance: number })[]>(
          `/distance/closest-cities/${params.slug}`,
        )
      ).data,
    initialPageParam: 1,
    getNextPageParam: () => null,
  });

  const { data: residents } = useInfiniteQuery<User[]>({
    queryKey: ['city', 'residents', +params.slug],
    queryFn: async () =>
      (
        await axios.get<User[]>(`/cities/${params.slug}/residents`, {
          params: {
            count: 5,
          },
        })
      ).data,
    initialPageParam: 1,
    getNextPageParam: () => null,
  });

  if (!images || !city.data || !visits) {
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
        <div className="aspect-square w-full">
          <GalleryCarousel
            plugins={[
              Autoplay({
                delay: 3500,
                stopOnMouseEnter: true,
                stopOnLastSnap: true,
              }),
            ]}
          >
            {images.pages.map((page) =>
              page.map((image) => (
                <CarouselItem key={image.id}>
                  <GalleryImage className="object-cover" image={image} />
                </CarouselItem>
              )),
            )}
          </GalleryCarousel>
        </div>
        {images.pages[0].length !== 0 && (
          <div className="w-full text-right mt-1">
            <SeeMore
              href={{ params: { slug: city.data.id }, pathname: '/city/[slug]/gallery' }}
            />
          </div>
        )}
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
      <div>
        <Ranking>
          <RankingHeader>
            <RankingTitle>{t('country-city-page.near-cities')}</RankingTitle>
          </RankingHeader>
          <RankingContent>
            {closest.isLoading && <RankingSkeleton count={10} />}
            {closest.data?.pages.map((page, pageIndex) =>
              page.map((city, index) => (
                <RankingItem key={city.id}>
                  <div className="flex gap-2 items-center w-full">
                    <h3 className="w-[24px] font-bold shrink-0">
                      {pageIndex * 10 + (index + 1)}º
                    </h3>
                    <Link
                      href={{
                        params: { slug: city.region.country.iso2 },
                        pathname: '/country/[slug]',
                      }}
                    >
                      <CountryFlag
                        className="w-[36px]"
                        iso2={city.region.country.iso2}
                        tooltip={city.region.country.name}
                      />
                    </Link>
                    <div className="flex justify-between min-w-0 w-full">
                      <div className="flex-1 whitespace-nowrap overflow-hidden text-ellipsis">
                        <Link
                          className="hover:underline mr-1"
                          href={{ params: { slug: city.id }, pathname: '/city/[slug]' }}
                        >
                          <span>{city.name}</span>
                        </Link>
                        <span className="text-muted-foreground">{city.region.name}</span>
                      </div>
                      <span className="whitespace-nowrap">
                        {city.distance.toFixed(1)} km
                      </span>
                    </div>
                  </div>
                </RankingItem>
              )),
            )}
          </RankingContent>
        </Ranking>
      </div>
      <div>
        <div className="mb-2 pb-1 border-b-2 border-primary">
          <h3 className="font-bold text-xl">
            {t('country-city-page.tabs.residents.label')}
          </h3>
        </div>
        {residents?.pages[0].length === 0 && (
          <div className="py-4 text-sm text-center">
            <span>{t('country-city-page.tabs.residents.no-residents')}</span>
          </div>
        )}
        {residents?.pages.map((page) =>
          page.map((user) => <Resident key={user.id} user={user} />),
        )}
        {residents?.pages[0].length === 5 && (
          <SeeMore
            href={{ params: { slug: params.slug }, pathname: '/city/[slug]/residents' }}
          />
        )}
      </div>
      <div className="sm:col-span-2">
        <div>
          <div className="mb-2">
            <h2 className="font-bold text-xl border-b-2 border-primary pb-1">
              {t('country-city-page.reviews')}
            </h2>
          </div>
          <div data-test="city-visits">
            {visits.pages[0].length === 0 && (
              <div className="py-4 text-sm text-center">
                <span>{t('country-city-page.tabs.reviews.no-reviews')}</span>
              </div>
            )}
            {visits.pages[0].length !== 0 &&
              visits.pages[0]
                .slice(0, 5)
                .map((visit) => <CityVisit key={visit.id} visit={visit} />)}
          </div>
          {visits.pages[0].length !== 0 && (
            <div className="w-full text-right mt-1">
              <SeeMore
                href={{ params: { slug: city.data.id }, pathname: '/city/[slug]/visits' }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
