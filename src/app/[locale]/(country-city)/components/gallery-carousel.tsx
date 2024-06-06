'use client';

import {
  CarouselContent,
  Carousel,
  CarouselNext,
  CarouselPrevious,
  CarouselApi,
} from '@/components/ui/carousel';
import { useTranslations } from 'next-intl';
import React, { ReactNode, useEffect, useState } from 'react';

interface GalleryCarouselProps extends React.ComponentProps<typeof Carousel> {
  hasNextPage?: boolean;
  fetchNextPage?: () => {};
  children: ReactNode;
  showArrows?: boolean;
}

export const GalleryCarousel = ({
  fetchNextPage,
  hasNextPage,
  children,
  showArrows,
  ...props
}: GalleryCarouselProps) => {
  const t = useTranslations();
  const [api, setApi] = useState<CarouselApi>();
  const [count, setCount] = useState<number>();
  const [current, setCurrent] = useState<number>(0);

  React.useEffect(() => {
    if (!api) {
      return;
    }

    setCurrent(api.selectedScrollSnap() + 1);
    setCount(api?.scrollSnapList().length);

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  useEffect(() => {
    if (!fetchNextPage) {
      return;
    }

    if (current % 10 === 9 && hasNextPage) {
      fetchNextPage();
    }
  }, [current, fetchNextPage, hasNextPage]);

  return (
    <div className="w-full h-full rounded-lg overflow-hidden border-2">
      {count === 0 && (
        <div className="justify-center text-muted-foreground text-sm flex h-full w-full items-center">
          <span>{t('country-city-page.no-images')}</span>
        </div>
      )}
      {count !== 0 && (
        <Carousel {...props} setApi={setApi} className="p-0">
          <CarouselContent className="p-0">{children}</CarouselContent>
          <CarouselPrevious className="left-3" />
          <CarouselNext className="right-3" />
        </Carousel>
      )}
    </div>
  );
};
