'use client';

import NextImage from 'next/image';
import React, { ReactNode, useRef, useState } from 'react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { getVideoThumbnail } from '@/utils/getVideoThumbnail';
import { zodResolver } from '@hookform/resolvers/zod';
import { Trash2, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Image as ImageIcon } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { useToast } from '@/components/ui/use-toast';
import { useCreateTip } from '@/hooks/useCreateTip';
import { SelectCity } from '@/components/select-city';

const createTipSchema = z.object({
  cityId: z.number(),
  message: z.string().min(1).max(300),
  tags: z.array(z.string()),
  medias: z
    .array(
      z.object({
        file: z.any(),
        thumbnail: z.string(),
      }),
    )
    .max(10),
});

export type CreateTipType = z.infer<typeof createTipSchema>;

export const CreateTip = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState<boolean>();
  const { toast } = useToast();
  const t = useTranslations();
  const createTip = useCreateTip();
  const imageInputFile = useRef<HTMLInputElement>(null);
  const {
    control,
    register,
    handleSubmit,
    setValue,
    watch,
    getValues,
    setError,
    reset,
    formState: { errors, dirtyFields },
  } = useForm<CreateTipType>({
    resolver: zodResolver(createTipSchema),
    defaultValues: {
      message: '',
      medias: [],
      tags: [],
      cityId: undefined,
    },
  });

  const handleCreatePost = async (data: CreateTipType) => {
    const formData = new FormData();

    data.medias.length &&
      data.medias.forEach((media) => formData.append('medias', media.file));
    formData.append('message', data.message);
    formData.append('cityId', data.cityId.toString());
    data.tags.length && formData.append('tags', data.tags.join(';'));

    await createTip.mutateAsync(formData);
    setOpen(false);
    reset(undefined, { keepDefaultValues: true });
  };

  const onOpenChange = (open: boolean) => {
    if (open) {
      reset(undefined, { keepDefaultValues: true });
      return setOpen(true);
    }

    if (Object.entries(dirtyFields).length) {
      const shouldClose = window.confirm(t('modal.close'));
      if (!shouldClose) return;
    }

    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent onInteractOutside={(e) => createTip.isPending && e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>{t('create-tip.title')}</DialogTitle>
        </DialogHeader>
        <form
          data-test="create-tip-form"
          className="space-y-4"
          onSubmit={handleSubmit(handleCreatePost)}
        >
          <div>
            <div className="justify-between flex mb-0.5">
              <Label>{t('create-trip-diary.city')}</Label>
            </div>
            <Controller
              name="cityId"
              control={control}
              render={({ field }) => (
                <SelectCity onSelect={(value) => field.onChange(+value)} />
              )}
            />
            {errors.cityId && (
              <span className="text-sm text-red-600 font-semibold">
                {t('create-trip-diary.city-field-error')}
              </span>
            )}
          </div>
          <div>
            <div className="flex items-baseline justify-between mb-0.5">
              <Label className="mr-1">{t('create-tip.message')}</Label>
              <Label className="text-muted-foreground text-xs">
                {watch('message')?.length || 0} / 300
              </Label>
            </div>
            <Textarea {...register('message')} className="max-h-[160px]" />
            {errors.message && (
              <span className="text-sm text-red-600 font-semibold">
                {errors.message.type === 'too_big'
                  ? t('create-tip.message-max-error')
                  : t('create-tip.message-error')}
              </span>
            )}
          </div>
          <div>
            <div className="mb-2">
              <div className="flex items-baseline justify-between mb-0.5">
                <Label className="mr-1">{t('create-tip.tags.label')}</Label>
                <Label className="hidden md:block text-muted-foreground text-xs">
                  {t('create-tip.tags.helper')}
                </Label>
              </div>
              <Input
                name="tags"
                placeholder={t('create-tip.tags.placeholder')}
                onKeyDown={(e) => {
                  if (e.key === 'Tab' || e.key === 'Enter') {
                    const currentTags = getValues('tags');

                    const tag = e.currentTarget.value.trim();

                    if (tag && !currentTags.find((currentTag) => tag === currentTag)) {
                      setValue('tags', [...currentTags, tag], {
                        shouldDirty: true,
                      });
                      e.currentTarget.value = '';
                    }

                    e.preventDefault();
                  }
                }}
              />
            </div>
            <div data-test="current-tags" className="flex flex-wrap gap-1">
              {watch('tags')?.map((tag) => (
                <div
                  className="px-1 flex items-center gap-1 h-fit rounded-sm bg-accent"
                  key={tag}
                >
                  <span className="text-xs max-w-[86px] text-ellipsis overflow-hidden whitespace-nowrap">
                    {tag}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const currentTags = getValues('tags');
                      setValue(
                        'tags',
                        currentTags.filter((currentTag) => currentTag !== tag),
                        {
                          shouldDirty: true,
                        },
                      );
                    }}
                  >
                    <X className="w-[12px]" />
                  </button>
                </div>
              ))}
            </div>
          </div>
          {watch('medias') && watch('medias')!.length > 0 && (
            <ScrollArea className="w-96 sm:w-[462px] whitespace-nowrap rounded-md border">
              <div data-test="medias" className="w-max flex justify-center gap-2">
                {watch('medias')?.map((file, index) => (
                  <div className="overflow-hidden relative w-[110px]" key={index}>
                    <AspectRatio ratio={1}>
                      <button
                        data-test={'delete-media-' + index}
                        type="button"
                        onClick={() =>
                          setValue(
                            'medias',
                            getValues('medias')?.filter(
                              (media) => media.thumbnail !== file.thumbnail,
                            ),
                            {
                              shouldDirty: true,
                            },
                          )
                        }
                        className="absolute top-1 right-1 z-20 bg-black p-1 rounded-full"
                      >
                        <Trash2 size={16} className="text-red-500" />
                      </button>
                      <NextImage
                        src={file.thumbnail}
                        className="object-cover"
                        alt=""
                        fill
                      />
                    </AspectRatio>
                  </div>
                ))}
                <ScrollBar orientation="horizontal" />
              </div>
            </ScrollArea>
          )}
          <div className="flex justify-between">
            <Controller
              control={control}
              name="medias"
              render={({ field }) => (
                <button
                  disabled={watch('medias')?.length === 10}
                  type="button"
                  data-test="button-medias"
                  onClick={() => imageInputFile.current?.click()}
                >
                  <ImageIcon className="text-blue-500" size={20} />
                  <Input
                    multiple
                    className="hidden"
                    type="file"
                    accept="image/jpeg,image/png,image/webp,video/mp4"
                    onChange={async (e) => {
                      const maxSize = 1048576 * 100;
                      const currentMedias = getValues('medias') as
                        | {
                            file: File;
                            thumbnail: string;
                          }[]
                        | undefined;

                      const currentMediasSize =
                        currentMedias?.reduce((acc, curr) => acc + curr.file.size, 0) ||
                        0;
                      const files = Array.from(e.target.files as ArrayLike<File>);
                      const newImagesSize = files.reduce(
                        (acc, curr) => acc + curr.size,
                        0,
                      );

                      if (
                        newImagesSize > maxSize - currentMediasSize ||
                        files.length > 10 - (currentMedias?.length || 0)
                      ) {
                        setError('medias', {
                          message: 'Max size is 100mb and 10 files',
                          type: 'max',
                        });
                        toast({
                          title: t('create-tip.max-size-files'),
                        });
                        return;
                      }

                      field.onChange(
                        await Promise.all(
                          files.map(async (file) => {
                            return {
                              file,
                              thumbnail: file.type.startsWith('video')
                                ? await getVideoThumbnail(file)
                                : URL.createObjectURL(file),
                            };
                          }),
                        ).then((arr) =>
                          currentMedias ? currentMedias.concat(arr) : arr,
                        ),
                      );

                      e.target.value = '';
                    }}
                    ref={imageInputFile}
                  />
                </button>
              )}
            />
            <Button
              loading={createTip.isPending}
              disabled={createTip.isPending}
              type="submit"
            >
              {t('create-tip.confirm')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
