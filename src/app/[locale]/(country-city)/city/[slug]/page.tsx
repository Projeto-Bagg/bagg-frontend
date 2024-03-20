'use client';

import axios from '@/services/axios';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import React from 'react';
import { LazyMap, LazyMarker, LazyTileLayer } from '@/components/leaflet-map';
import { CityVisit } from '@/components/city-visit';
import { useTranslations } from 'next-intl';
import { Link } from '@/common/navigation';
import { ChevronRight } from 'lucide-react';
import { Gallery } from '@/app/[locale]/(country-city)/gallery';
import { GalleryImage } from '@/app/[locale]/(country-city)/gallery-image';

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
        <div className="w-full aspect-square">
          <Gallery autoPlay>
            {images.pages.map((page) =>
              page.map((image) => (
                <GalleryImage className="object-cover" image={image} key={image.id} />
              )),
            )}
          </Gallery>
        </div>
        {images.pages[0].length !== 0 && (
          <div className="w-full text-right mt-1">
            <Link
              href={{ params: { slug: city.data.id }, pathname: '/city/[slug]/gallery' }}
              className="text-primary text-sm font-bold uppercase hover:underline"
            >
              <div className="flex gap-0.5 items-center justify-end">
                <span>{t('country-city-page.view-more-reviews')}</span>
                <ChevronRight className="w-[24px]" />
              </div>
            </Link>
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
                .map((visit) => <CityVisit key={visit.id} visit={visit} />)}
          </div>
          {visits.pages[0].length !== 0 && (
            <div className="w-full text-right mt-1">
              <Link
                href={{ params: { slug: city.data.id }, pathname: '/city/[slug]/visits' }}
                className="text-primary text-sm font-bold uppercase hover:underline"
              >
                <div className="flex gap-0.5 items-center justify-end">
                  <span>{t('country-city-page.view-more-reviews')}</span>
                  <ChevronRight className="w-[24px]" />
                </div>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
