'use client';

import { SelectCity } from '@/components/select-city';
import { Button } from '@/components/ui/button';
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useCreateTripDiary } from '@/hooks/trip-diary';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

const createTripDiarySchema = z.object({
  title: z.string().min(1).max(255),
  message: z.string().max(300),
  cityId: z.number(),
});

export type CreateTripDiaryType = z.infer<typeof createTripDiarySchema>;

interface Props {
  setIsCreatingTripDiary: React.Dispatch<React.SetStateAction<boolean>>;
  onCreate: (tripDiaryId: number) => void;
}

export const CreateTripDiary = ({ setIsCreatingTripDiary, onCreate }: Props) => {
  const createTripDiary = useCreateTripDiary();
  const t = useTranslations();
  const {
    register,
    handleSubmit,
    reset,
    watch,
    control,
    formState: { errors, dirtyFields },
  } = useForm<CreateTripDiaryType>({
    resolver: zodResolver(createTripDiarySchema),
  });

  const handleCreateTripDiary = async (data: CreateTripDiaryType) => {
    const tripDiary = await createTripDiary.mutateAsync(data);
    setIsCreatingTripDiary(false);
    onCreate(tripDiary.id);
    reset(undefined, { keepDefaultValues: true });
  };

  const onClose = () => {
    if (Object.entries(dirtyFields).length) {
      const shouldClose = window.confirm(t('modal.close'));
      if (!shouldClose) return;
    }

    setIsCreatingTripDiary(false);
  };

  return (
    <form
      data-test="create-trip-diary-form"
      className="space-y-4"
      onSubmit={handleSubmit(handleCreateTripDiary)}
    >
      <DialogHeader>
        <DialogTitle>{t('create-trip-diary.title')}</DialogTitle>
        <DialogDescription>{t('create-trip-diary.description')}</DialogDescription>
      </DialogHeader>
      <div>
        <div>
          <Label className="mr-1">{t('create-trip-diary.title-field')}</Label>
          <Label className="text-muted-foreground text-xs">
            {watch('title')?.length || 0} / 255
          </Label>
        </div>
        <Input {...register('title')} />
        {errors.title && (
          <span className="text-sm text-red-600 font-semibold">
            {errors.title.type === 'too_big'
              ? t('create-trip-diary.title-field-max-error')
              : t('create-trip-diary.title-field-error')}
          </span>
        )}
      </div>
      <div>
        <div>
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
        <div>
          <Label className="mr-1">{t('create-trip-diary.message')}</Label>
          <Label className="text-muted-foreground text-xs">
            {watch('message')?.length || 0} / 300
          </Label>
        </div>
        <Textarea {...register('message')} className="max-h-[160px]" />
        {errors.message && (
          <span className="text-sm text-red-600 font-semibold">
            {errors.message.type === 'too_big'
              ? t('create-trip-diary.message-max-error')
              : t('create-trip-diary.message-error')}
          </span>
        )}
      </div>
      <DialogFooter>
        <Button variant={'destructive'} onClick={onClose}>
          {t('create-trip-diary.cancel')}
        </Button>
        <Button
          disabled={createTripDiary.isPending}
          loading={createTripDiary.isPending}
          type="submit"
        >
          {t('create-trip-diary.confirm')}
        </Button>
      </DialogFooter>
    </form>
  );
};
