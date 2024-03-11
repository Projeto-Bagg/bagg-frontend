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
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { getVideoThumbnail } from '@/utils/getVideoThumbnail';
import { zodResolver } from '@hookform/resolvers/zod';
import { Info, Trash2 } from 'lucide-react';
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
  medias: z
    .array(
      z.object({
        file: z.any(),
        thumbnail: z.string(),
      }),
    )
    .max(10)
    .optional(),
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
    formState: { errors, isDirty },
  } = useForm<CreateTipType>({
    resolver: zodResolver(createTipSchema),
    defaultValues: {
      message: '',
    },
  });

  const handleCreatePost = async (data: CreateTipType) => {
    const formData = new FormData();

    data.medias && data.medias.forEach((media) => formData.append('medias', media.file));
    formData.append('message', data.message);
    formData.append('cityId', data.cityId.toString());

    await createTip.mutateAsync(formData);
    setOpen(false);
    reset(undefined, { keepDefaultValues: true });
  };

  const onOpenChange = (open: boolean) => {
    if (open) {
      return setOpen(true);
    }

    if (isDirty) {
      const shouldClose = window.confirm(t('modal.close'));
      if (!shouldClose) return;
    }

    setOpen(false);
    reset(undefined, { keepDefaultValues: true });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent onInteractOutside={(e) => createTip.isPending && e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>{t('createTip.title')}</DialogTitle>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit(handleCreatePost)}>
          <div>
            <div className="justify-between flex mb-0.5">
              <div className="flex gap-1 items-end">
                <Label>{t('createTripDiary.city')}</Label>
              </div>
              {errors.cityId && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info size={18} className="text-red-600" />
                  </TooltipTrigger>
                  <TooltipContent>{t('createTripDiary.cityFieldError')}</TooltipContent>
                </Tooltip>
              )}
            </div>
            <Controller
              name="cityId"
              control={control}
              render={({ field }) => (
                <SelectCity onSelect={(value) => field.onChange(+value)} />
              )}
            />
          </div>
          <div>
            <div className="flex justify-between mb-0.5">
              <div className="flex gap-1 items-end">
                <Label>{t('createTip.message')}</Label>
                <Label className="text-muted-foreground text-xs">
                  {watch('message')?.length || 0} / 300
                </Label>
              </div>
              {errors.message && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info size={18} className="text-red-600" />
                  </TooltipTrigger>
                  <TooltipContent>
                    {errors.message.type === 'too_big'
                      ? t('createTip.messageMaxError')
                      : t('createTip.messageError')}
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
            <Textarea {...register('message')} className="max-h-[160px]" />
          </div>
          {watch('medias') && watch('medias')!.length > 0 && (
            <ScrollArea className="w-96 sm:w-[462px] whitespace-nowrap rounded-md border">
              <div className="w-max flex justify-center gap-2 ">
                {watch('medias')?.map((file, index) => (
                  <div className="overflow-hidden relative w-[110px]" key={index}>
                    <AspectRatio ratio={1}>
                      <div className="absolute top-1 right-1 z-20 bg-black p-1 rounded-full">
                        <Trash2
                          onClick={() =>
                            setValue(
                              'medias',
                              getValues('medias')?.filter(
                                (media) => media.file.name !== file.file.name,
                              ),
                            )
                          }
                          size={16}
                          className="text-red-500"
                        />
                      </div>
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
                  onClick={() => imageInputFile.current?.click()}
                >
                  <ImageIcon className="text-blue-500" size={20} />
                  <Input
                    multiple
                    className="hidden"
                    type="file"
                    accept="image/jpeg,image/png,image/webp,video/mp4"
                    onChange={async (e) => {
                      const maxSize = 104857600;
                      const currentImages = getValues('medias') as {
                        file: File;
                        thumbnail: string;
                      }[];
                      const currentImagesSize =
                        currentImages?.reduce((acc, curr) => acc + curr.file.size, 0) ||
                        0;
                      const files = Array.from(e.target.files as ArrayLike<File>);
                      const newImagesSize = files.reduce(
                        (acc, curr) => acc + curr.size,
                        0,
                      );

                      if (
                        newImagesSize > maxSize - currentImagesSize ||
                        files.length > 10 - (currentImages?.length || 0)
                      ) {
                        setError('medias', {
                          message: 'Max size is 100mb and 10 files',
                          type: 'max',
                        });
                        toast({
                          title: t('createTip.maxSizeFiles'),
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
                        ).then((arr) => arr.concat(currentImages || [])),
                      );
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
              {t('createTip.confirm')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
