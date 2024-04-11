'use client';

import React from 'react';
import { GalleryCarousel } from '@/app/[locale]/(country-city)/gallery-carousel';
import { GalleryImage } from '@/app/[locale]/(country-city)/gallery-image';
import { CityRatingRanking } from '@/components/city-rating-ranking';
import { CityVisit } from '@/components/city-visit';
import { CityVisitRanking } from '@/components/city-visit-ranking';
import { LazyMap, LazyMarker, LazyTileLayer } from '@/components/leaflet-map';
import { CarouselItem } from '@/components/ui/carousel';
import axios from '@/services/axios';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import Autoplay from 'embla-carousel-autoplay';
import { SeeMore } from '@/components/see-more';

export default function Page({ params }: { params: { slug: string } }) {
  const t = useTranslations();

  const country = useQuery<CountryPage>({
    queryFn: async () => (await axios.get<CountryPage>('/countries/' + params.slug)).data,
    queryKey: ['country', params.slug],
  });

  const { data: images } = useInfiniteQuery<CountryCityImage[]>({
    queryFn: async () =>
      (await axios.get<CountryCityImage[]>(`/countries/${params.slug}/images`)).data,
    queryKey: ['country-images', params.slug],
    initialPageParam: 1,
    getNextPageParam: () => null,
  });

  const { data: visits } = useInfiniteQuery<CountryCityVisit[]>({
    queryKey: ['city-visits', 'country', params.slug],
    queryFn: async () =>
      (await axios.get<CountryCityVisit[]>(`/city-visits/country/${params.slug}`)).data,
    initialPageParam: 1,
    getNextPageParam: (page, allPages) =>
      page.length === 10 ? allPages.length + 1 : null,
  });

  if (!country.data || !images || !visits) {
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
              href={{
                params: { slug: country.data.iso2 },
                pathname: '/country/[slug]/gallery',
              }}
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
      <CityRatingRanking countryIso2={country.data.iso2} seeMore />
      <CityVisitRanking countryIso2={country.data.iso2} seeMore />
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
                <span>{t('country-city-page.tabs.reviews.no-reviews')}</span>
              </div>
            )}
            {visits.pages[0].length !== 0 &&
              visits.pages[0]
                .slice(0, 5)
                .map((visit) => (
                  <CityVisit key={visit.id} visit={visit} city={visit.city} />
                ))}
          </div>
          {visits.pages[0].length !== 0 && (
            <div className="w-full text-right mt-1">
              <SeeMore
                href={{
                  params: { slug: params.slug },
                  pathname: '/country/[slug]/visits',
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
