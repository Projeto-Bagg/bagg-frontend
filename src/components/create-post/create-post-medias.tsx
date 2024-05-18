import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { Trash2 } from 'lucide-react';
import React from 'react';
import {
  FieldValues,
  UseFormSetValue,
  FieldPath,
  PathValue,
  Path,
} from 'react-hook-form';

interface CreatePostMediasProps<T extends FieldValues> {
  medias: Media[] | undefined;
  setValue: UseFormSetValue<T>;
}

interface Media {
  file?: any;
  thumbnail: string;
}

export const CreatePostMedias = <T extends FieldValues>({
  medias,
  setValue,
}: CreatePostMediasProps<T>) => {
  return (
    medias &&
    medias.length >= 0 && (
      <Carousel opts={{ dragFree: true }}>
        <CarouselContent data-test="medias">
          {medias.map((file, index) => (
            <CarouselItem
              className="overflow-hidden relative w-[110px] basis-auto"
              key={index}
            >
              <AspectRatio ratio={1}>
                <button
                  data-test={'delete-media-' + index}
                  type="button"
                  onClick={() => {
                    setValue(
                      'medias' as Path<T>,
                      medias.filter((_, i) => i !== index) as PathValue<T, FieldPath<T>>,
                      {
                        shouldDirty: true,
                      },
                    );
                  }}
                  className="absolute top-1 right-1 z-20 bg-black p-1 rounded-full"
                >
                  <Trash2 size={16} className="text-red-500" />
                </button>
                <img
                  src={file.thumbnail}
                  className="object-cover absolute w-full h-full inset-0"
                  alt=""
                />
              </AspectRatio>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    )
  );
};
