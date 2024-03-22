'use client';

import { GalleryCarousel } from '@/app/[locale]/(country-city)/gallery-carousel';
import { GalleryImage } from '@/app/[locale]/(country-city)/gallery-image';
import { CarouselItem } from '@/components/ui/carousel';
import axios from '@/services/axios';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import React from 'react';

export default function GalleryPage({ params }: { params: { slug: string } }) {
  const t = useTranslations();

  const {
    data: images,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery<CountryCityImage[]>({
    queryKey: ['city-images', +params.slug],
    queryFn: async ({ pageParam }) =>
      (
        await axios.get<CountryCityImage[]>(`/cities/${params.slug}/images`, {
          params: {
            page: pageParam,
          },
        })
      ).data,
    initialPageParam: 1,
    getNextPageParam: (page, allPages) =>
      page.length === 10 ? allPages.length + 1 : null,
  });

  if (!images) {
    return;
  }

  return (
    <div>
      <div className="mb-2">
        <h2 className="font-bold text-xl border-b-2 border-primary pb-1">
          {t('country-city-page.gallery')}
        </h2>
      </div>
      <div className="w-full aspect-[16/12]">
        <GalleryCarousel
          showArrows
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage}
        >
          {images.pages.map((page) =>
            page.map((image) => (
              <CarouselItem key={image.id}>
                <GalleryImage className="aspect-[16/12] object-contain" image={image} />
              </CarouselItem>
            )),
          )}
        </GalleryCarousel>
      </div>
    </div>
  );
}
