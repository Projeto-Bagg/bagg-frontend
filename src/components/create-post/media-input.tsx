'use client';

import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { getVideoThumbnail } from '@/utils/get-video-thumbnail';
import { ImageIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import React, { useRef } from 'react';
import { FieldValues, Path, UseFormSetError } from 'react-hook-form';

interface MediaInputProps<T extends FieldValues> {
  medias: Media[] | undefined;
  onChange: (...event: any[]) => void;
  setError: UseFormSetError<T>;
}

interface Media {
  file?: any;
  thumbnail: string;
}

export const MediaInput = <T extends FieldValues>({
  medias,
  onChange,
  setError,
}: MediaInputProps<T>) => {
  const mediaInputRef = useRef<HTMLInputElement>(null);
  const t = useTranslations();

  return (
    <button
      disabled={medias?.length === 10}
      type="button"
      data-test="button-medias"
      onClick={() => mediaInputRef.current?.click()}
    >
      <ImageIcon className="text-blue-500" size={20} />
      <Input
        multiple
        className="hidden"
        type="file"
        accept="image/jpeg,image/png,image/webp,video/mp4"
        onChange={async (e) => {
          const maxSize = 1048576 * 100;

          const currentMediasSize =
            medias?.reduce((acc, curr) => acc + curr.file.size, 0) || 0;
          const files = Array.from(e.target.files as ArrayLike<File>);
          const newImagesSize = files.reduce((acc, curr) => acc + curr.size, 0);

          if (
            newImagesSize > maxSize - currentMediasSize ||
            files.length > 10 - (medias?.length || 0)
          ) {
            setError('medias' as Path<T>, {
              message: 'Max size is 100mb and 10 files',
              type: 'max',
            });
            toast({
              title: t('create-tip.max-size-files'),
              variant: 'destructive',
            });
            return;
          }

          onChange(
            await Promise.all(
              files.map(async (file) => {
                return {
                  file,
                  thumbnail: file.type.startsWith('video')
                    ? await getVideoThumbnail(file)
                    : URL.createObjectURL(file),
                };
              }),
            ).then((arr) => (medias ? medias.concat(arr) : arr)),
          );

          e.target.value = '';
        }}
        ref={mediaInputRef}
      />
    </button>
  );
};
