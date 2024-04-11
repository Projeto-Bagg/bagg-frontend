import { useRouter } from '@/common/navigation';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
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
import { useAuth } from '@/context/auth-context';
import { useCreateCityVisit } from '@/hooks/useCreateCityVisit';
import { useUpdateCityVisit } from '@/hooks/useUpdateCityVisit';
import { zodResolver } from '@hookform/resolvers/zod';
import { Rating } from '@smastrom/react-rating';
import { useTranslations } from 'next-intl';
import React, { ReactNode, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

interface CreateCityVisitProps {
  children: ReactNode;
  city: CityPage;
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
  const auth = useAuth();
  const router = useRouter();

  const {
    handleSubmit,
    control,
    formState: { errors, dirtyFields, defaultValues },
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
    if (open && !auth.user) {
      setOpen(false);
      return router.push('/login');
    }

    if (open && auth.user) {
      reset({
        message: city.userVisit?.message || '',
        rating: city.userVisit?.rating || 0,
      });
      return setOpen(true);
    }

    if (Object.entries(dirtyFields).length) {
      const shouldClose = window.confirm(t('modal.close'));
      if (!shouldClose) return;
    }

    setOpen(false);
  };

  const deleteReview = async () => {
    if (!city.userVisit) {
      return;
    }

    await updateCityVisit.mutateAsync({
      cityId: city.id,
      message: null,
      rating: null,
    });

    reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger id="create-city-visit">{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('create-city-visit.title')}</DialogTitle>
          <div className="flex text-sm justify-center sm:justify-start items-center gap-2 text-foreground">
            <span>
              {city.name}, {city.region.name}, {city.region.country.name}
            </span>
            <CountryFlag iso2={city.region.country.iso2} />
          </div>
          <DialogDescription>{t('create-city-visit.description')}</DialogDescription>
        </DialogHeader>
        <form
          id="create-city-visit-form"
          className="space-y-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div>
            <div className="flex justify-between mb-0.5">
              <div className="flex gap-1 items-end">
                <Label>{t('create-city-visit.message')}</Label>
                <Label className="text-muted-foreground text-xs">
                  {watch('message')?.length || 0} / 300
                </Label>
              </div>
            </div>
            <Textarea {...register('message')} className="max-h-[160px]" />
            {errors.message && (
              <span className="text-sm text-red-600 font-semibold">
                {errors.message.type === 'too_big'
                  ? t('create-city-visit.message-max-error')
                  : t('create-city-visit.message-error')}
              </span>
            )}
          </div>
          <div>
            <div className="flex justify-between mb-0.5">
              <Label>{t('create-city-visit.rating')}</Label>
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
            {errors.rating && (
              <span className="text-sm text-red-600 font-semibold">
                {t('create-city-visit.ratingError')}
              </span>
            )}
          </div>
          <div className="flex gap-2 justify-end">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button type="button" variant={'destructive'} disabled={!city.userVisit}>
                  {t('create-city-visit.delete.label')}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    {t('create-city-visit.delete.delete-modal.title')}
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    {t('create-city-visit.delete.delete-modal.description')}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>
                    {t('create-city-visit.delete.delete-modal.cancel')}
                  </AlertDialogCancel>
                  <AlertDialogAction onClick={deleteReview}>
                    {t('create-city-visit.delete.delete-modal.action')}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <Button
              loading={createCityVisit.isPending || updateCityVisit.isPending}
              disabled={createCityVisit.isPending || updateCityVisit.isPending}
              type="submit"
            >
              {t('create-city-visit.confirm')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
