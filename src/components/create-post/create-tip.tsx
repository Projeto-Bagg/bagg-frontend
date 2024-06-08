'use client';

import React, { ReactNode, useState } from 'react';
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
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { useCreateTip } from '@/hooks/tip';
import { SelectCity } from '@/components/select-city';
import { CreatePostMedias } from '@/components/create-post/create-post-medias';
import { MediaInput } from '@/components/create-post/media-input';
import { useRouter } from '@/common/navigation';

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
  const t = useTranslations();
  const createTip = useCreateTip();
  const router = useRouter();
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
    mode: 'onChange',
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

    const tip = await createTip.mutateAsync(formData);
    router.push({ params: { slug: tip.id }, pathname: '/tip/[slug]' });
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
                <SelectCity
                  onSelect={(value) => field.onChange(value ? Number(value) : undefined)}
                />
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
          <CreatePostMedias medias={watch('medias')} setValue={setValue} />
          <div className="flex justify-between">
            <Controller
              control={control}
              name="medias"
              render={({ field }) => (
                <MediaInput
                  medias={watch('medias')}
                  onChange={field.onChange}
                  setError={setError}
                />
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
