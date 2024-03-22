import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import Image from 'next/image';
import React from 'react';

interface MediasProps {
  medias: Media[];
}

export const Medias = ({ medias }: MediasProps) => {
  return (
    medias.length !== 0 && (
      <div className="mt-2">
        {medias.length === 1 && (
          <div className="relative aspect-square max-w-[711px] max-h-[400px]">
            {medias[0].url.endsWith('mp4') ? (
              <div
                key={medias[0].id}
                className="h-full flex justify-center items-center bg-black rounded-lg"
              >
                <video controls src={medias[0].url} />
              </div>
            ) : (
              <Image
                src={medias[0].url}
                alt=""
                fill
                className="h-full w-full rounded-lg aspect-square object-center object-cover"
              />
            )}
          </div>
        )}
        {medias.length === 2 && (
          <div className="grid aspect-[16/9] grid-cols-[minmax(0px,_75fr)_minmax(0px,_75fr)] grid-rows-[100%] w-full">
            {medias.map((media) =>
              media.url.endsWith('mp4') ? (
                <div
                  key={media.id}
                  className="h-full flex justify-center items-center bg-black rounded-lg"
                >
                  <video controls src={media.url} />
                </div>
              ) : (
                <div key={media.id} className="relative mr-1">
                  <Image
                    src={media.url}
                    alt=""
                    fill
                    className="h-full rounded-lg object-cover"
                  />
                </div>
              ),
            )}
          </div>
        )}
        {medias.length > 2 && (
          <Carousel
            opts={{ dragFree: true }}
            className="no-scrollbar px-4 -ml-[72px] relative"
          >
            <CarouselContent>
              <div className="w-[56px] h-full shrink-0" />
              {medias.map((media) => (
                <CarouselItem key={media.id} className="basis-auto">
                  <div className="">
                    {media.url.endsWith('mp4') ? (
                      <div
                        key={media.id}
                        className="h-full flex justify-center items-center bg-black rounded-lg"
                      >
                        <video controls src={media.url} />
                      </div>
                    ) : (
                      <Image
                        src={media.url}
                        alt=""
                        width={320}
                        height={320}
                        draggable={false}
                        className="h-full rounded-lg aspect-square object-cover"
                      />
                    )}
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        )}
      </div>
    )
  );
};
