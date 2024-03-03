'use client';

import { SelectCity } from '@/components/select-city';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useCreateTripDiary } from '@/hooks/useCreateTripDiary';
import { zodResolver } from '@hookform/resolvers/zod';
import { Info } from 'lucide-react';
import { useTranslations } from 'next-intl';
import React, { ReactNode, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

const createTripDiarySchema = z.object({
  title: z.string().nonempty().max(255),
  message: z.string().max(300),
  cityId: z.number(),
});

export type CreateTripDiaryType = z.infer<typeof createTripDiarySchema>;

export const CreateTripDiary = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState<boolean>();
  const createTripDiary = useCreateTripDiary();
  const t = useTranslations();
  const {
    register,
    handleSubmit,
    reset,
    watch,
    control,
    formState: { errors },
  } = useForm<CreateTripDiaryType>({
    resolver: zodResolver(createTripDiarySchema),
  });

  const handleCreateTripDiary = async (data: CreateTripDiaryType) => {
    console.log(data);
    await createTripDiary.mutateAsync(data);
    setOpen(false);
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="text-primary">{children}</DialogTrigger>
      <DialogContent
        onInteractOutside={(e) => createTripDiary.isPending && e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>{t('createTripDiary.title')}</DialogTitle>
          <DialogDescription>{t('createTripDiary.description')}</DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit(handleCreateTripDiary)}>
          <div>
            <div className="justify-between flex mb-0.5">
              <div className="flex gap-1 items-end">
                <Label>{t('createTripDiary.titleField')}</Label>
                <Label className="text-muted-foreground text-xs">
                  {watch('title')?.length || 0} / 255
                </Label>
              </div>
              {errors.title && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info size={18} className="text-red-600" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <TooltipContent>
                      {errors.title.type === 'too_big'
                        ? t('createTripDiary.titleFieldMaxError')
                        : t('createTripDiary.titleFieldError')}
                    </TooltipContent>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
            <Input {...register('title')} />
          </div>
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
            <div className="justify-between flex mb-0.5">
              <div className="flex gap-1 items-end">
                <Label>{t('createTripDiary.message')}</Label>
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
                      ? t('createTripDiary.messageMaxError')
                      : t('createTripDiary.messageError')}
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
            <Textarea {...register('message')} className="max-h-[160px]" />
          </div>
          <DialogFooter>
            <Button
              disabled={createTripDiary.isPending}
              loading={createTripDiary.isPending}
              type="submit"
            >
              {t('createTripDiary.confirm')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
