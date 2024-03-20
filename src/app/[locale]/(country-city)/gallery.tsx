import { useTranslations } from 'next-intl';
import React, { useEffect, useState } from 'react';
import { Carousel } from 'react-responsive-carousel';

interface GalleryProps {
  hasNextPage?: boolean;
  fetchNextPage?: () => {};
  children: React.ReactChild[][];
  autoPlay?: boolean;
}

export const Gallery = ({
  fetchNextPage,
  hasNextPage,
  autoPlay,
  children,
}: GalleryProps) => {
  const t = useTranslations();
  const [selectedItem, setSelectedItem] = useState<number>(0);

  useEffect(() => {
    if (!fetchNextPage) {
      return;
    }

    if (selectedItem % 5 === 4 && hasNextPage) {
      fetchNextPage();
    }
  }, [selectedItem, fetchNextPage, hasNextPage]);

  return (
    <div className="w-full h-full">
      <div className="border-2 w-full h-full rounded-lg relative overflow-hidden">
        {children[0].length === 0 && (
          <div className="justify-center text-sm flex h-full w-full items-center">
            <span>{t('country-city-page.no-images')}</span>
          </div>
        )}
        {children.length !== 0 && (
          <Carousel
            onChange={(index) => setSelectedItem(index)}
            autoPlay={autoPlay}
            showStatus={false}
            showIndicators={false}
            stopOnHover
          >
            {children
              .map((page) =>
                page.map((image, index) => {
                  if (
                    index === selectedItem ||
                    index === selectedItem + 1 ||
                    index === selectedItem - 1
                  ) {
                    return image;
                  } else return <React.Fragment key={index} />;
                }),
              )
              .flat(1)}
          </Carousel>
        )}
      </div>
    </div>
  );
};
