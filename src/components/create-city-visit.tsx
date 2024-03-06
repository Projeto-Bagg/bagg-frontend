import { Button } from '@/components/ui/button';
import { CountryFlag } from '@/components/ui/country-flag';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useCreateCityVisit } from '@/hooks/useCreateCityVisit';
import { useUpdateCityVisit } from '@/hooks/useUpdateCityVisit';
import { zodResolver } from '@hookform/resolvers/zod';
import { Rating } from '@smastrom/react-rating';
import { Info } from 'lucide-react';
import { useTranslations } from 'next-intl';
import React, { ReactNode, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

interface CreateCityVisitProps {
  children: ReactNode;
  city: City;
}

const createCityVisitSchema = z.object({
  message: z.string().min(1).max(300),
  rating: z.number().min(1).max(5),
});

type CreateCityVisitType = z.infer<typeof createCityVisitSchema>;

export const CreateCityVisit = ({ children, city }: CreateCityVisitProps) => {
  const t = useTranslations();
  const createCityVisit = useCreateCityVisit();
  const updateCityVisit = useUpdateCityVisit();
  const [open, setOpen] = useState<boolean>();

  const {
    handleSubmit,
    control,
    formState: { errors, isDirty, defaultValues },
    register,
    reset,
    watch,
  } = useForm<CreateCityVisitType>({
    resolver: zodResolver(createCityVisitSchema),
    defaultValues: {
      message: city.userVisit?.message || '',
      rating: city.userVisit?.rating || 0,
    },
  });

  const onSubmit = async (data: CreateCityVisitType) => {
    if (city.userVisit) {
      await updateCityVisit.mutateAsync({
        cityId: city.id,
        message: data.message,
        rating: data.rating,
      });

      return setOpen(false);
    }

    await createCityVisit.mutateAsync({
      cityId: city.id,
      message: data.message,
      rating: data.rating,
    });

    setOpen(false);
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
    reset(defaultValues, { keepDefaultValues: true });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('createCityVisit.title')}</DialogTitle>
          <DialogDescription>
            <div className="flex items-center gap-2 text-foreground">
              <span>
                {city.name}, {city.region.name}, {city.region.country.name}
              </span>
              <CountryFlag iso2={city.region.country.iso2} />
            </div>
            <div>{t('createCityVisit.description')}</div>
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <div className="flex justify-between mb-0.5">
              <div className="flex gap-1 items-end">
                <Label>{t('createCityVisit.message')}</Label>
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
                      ? t('createCityVisit.messageMaxError')
                      : t('createCityVisit.messageError')}
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
            <Textarea {...register('message')} className="max-h-[160px]" />
          </div>
          <div>
            <div className="flex justify-between mb-0.5">
              <div>
                <Label>{t('createCityVisit.rating')}</Label>
              </div>
              {errors.rating && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info size={18} className="text-red-600" />
                  </TooltipTrigger>
                  <TooltipContent>{t('createCityVisit.ratingError')}</TooltipContent>
                </Tooltip>
              )}
            </div>
            <Controller
              control={control}
              name="rating"
              rules={{
                validate: (rating) => rating > 0,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Rating
                  className="max-w-[120px]"
                  value={value}
                  isRequired
                  onChange={onChange}
                  onBlur={onBlur}
                />
              )}
            />
          </div>

          <div className="flex justify-end">
            <Button
              loading={createCityVisit.isPending || updateCityVisit.isPending}
              disabled={createCityVisit.isPending || updateCityVisit.isPending}
              type="submit"
            >
              {t('createCityVisit.confirm')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
