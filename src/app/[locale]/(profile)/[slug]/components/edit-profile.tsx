'use client';

import React, { ReactNode, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/context/auth-context';
import { ProfilePicDialog } from '@/app/[locale]/(profile)/[slug]/components/profile-pic-dialog';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { SelectCity } from '@/components/select-city';
import { BirthdateDay } from '@/components/form/birthdate-day';
import { BrithdateMonth } from '@/components/form/birthdate-month';
import { BirthdateYear } from '@/components/form/birthdate-year';
import { useDeleteProfilePic, useUpdateProfile } from '@/hooks/profile';

const editFormSchema = z.object({
  fullName: z.string().min(3).max(64),
  cityId: z.number().optional().nullable(),
  birthdateDay: z.string().min(1),
  birthdateMonth: z.string().min(1),
  birthdateYear: z.string().min(1),
  bio: z.string().max(300).nullable(),
  profilePic: z
    .object({
      file: z.any(),
      url: z.string(),
    })
    .nullable()
    .optional(),
});

type EditFormType = z.infer<typeof editFormSchema>;

export type EditFormTypeWithDate = Omit<
  EditFormType,
  'birthdateDay' | 'birthdateMonth' | 'birthdateYear'
> & {
  birthdate?: Date;
};

export const EditProfile = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState<boolean>();
  const auth = useAuth();
  const [loading, setLoading] = useState<boolean>();
  const updateProfile = useUpdateProfile();
  const t = useTranslations();
  const deletePic = useDeleteProfilePic();
  const {
    watch,
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors, dirtyFields },
  } = useForm<EditFormType>({
    resolver: zodResolver(editFormSchema),
    mode: 'onChange',
    defaultValues: {
      bio: auth.user?.bio,
      fullName: auth.user?.fullName,
      cityId: auth.user?.city?.id,
      birthdateDay: auth.user?.birthdate.getDate().toString(),
      birthdateMonth: auth.user?.birthdate.getMonth().toString(),
      birthdateYear: auth.user?.birthdate.getFullYear().toString(),
    },
  });

  const handleEdit = async (data: EditFormType) => {
    try {
      setLoading(true);

      if (data.profilePic === null) {
        await deletePic.mutateAsync();
      }

      const formData = new FormData();
      data.profilePic && formData.append('profilePic', data.profilePic.file);
      formData.append('fullName', data.fullName);
      data.bio && formData.append('bio', data.bio);
      data.cityId && formData.append('cityId', data.cityId.toString());

      const birthdate = new Date(
        +data.birthdateYear,
        +data.birthdateMonth,
        +data.birthdateDay,
      );

      formData.append('birthdate', birthdate.toISOString());
      const { data: user } = await updateProfile.mutateAsync(formData);
      setOpen(false);

      reset({
        ...user,
        birthdateDay: user.birthdate.getDate().toString(),
        birthdateMonth: user.birthdate.getMonth().toString(),
        birthdateYear: user.birthdate.getFullYear().toString(),
      });
    } catch (error: any) {
    } finally {
      setLoading(false);
    }
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('edit-profile.title')}</DialogTitle>
          <DialogDescription>{t('edit-profile.description')}</DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit(handleEdit)}>
          <div>
            <ProfilePicDialog onSubmit={(f) => setValue('profilePic', f)}>
              <div className="flex items-center gap-2.5 w-fit">
                <Avatar className="w-[72px] h-[72px]">
                  <AvatarImage
                    src={
                      watch('profilePic') === null
                        ? undefined
                        : watch('profilePic')?.url || auth.user?.image
                    }
                  />
                </Avatar>
                <span className="text-sm font-bold text-blue-600">
                  {t('edit-profile.edit-profile-pic')}
                </span>
              </div>
            </ProfilePicDialog>
          </div>
          <div>
            <div>
              <Label className="mr-1">{t('signup-edit.name.label')}</Label>
              <Label className="text-muted-foreground text-xs">
                {watch('fullName')?.length || auth.user?.fullName.length || 0} / 64
              </Label>
            </div>
            <Input {...register('fullName')} />
            {errors.fullName && (
              <span className="text-sm text-red-600 font-semibold">
                {errors.fullName.type === 'too_big'
                  ? t('signup-edit.name.max-length-error')
                  : t('signup-edit.name.too-small')}
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
                  defaultValue={auth.user?.city}
                  onSelect={(value) => field.onChange(value ? Number(value) : null)}
                />
              )}
            />
          </div>
          <div>
            <div>
              <Label className="mr-1">{t('edit-profile.bio')}</Label>
              <Label className="text-muted-foreground text-xs">
                {watch('bio')?.length || auth.user?.bio?.length || 0} / 300
              </Label>
            </div>
            <Textarea className="max-h-[144px]" {...register('bio')} />
            {errors.bio && (
              <span className="text-sm text-red-600 font-semibold">
                {t('edit-profile.bio-size-error')}
              </span>
            )}
          </div>
          <div>
            <Label>{t('signup-edit.birthdate.label')}</Label>
            <div className="flex gap-2 justify-between">
              <Controller
                name="birthdateDay"
                control={control}
                render={({ field }) => (
                  <BirthdateDay
                    day={watch('birthdateDay')}
                    month={watch('birthdateMonth')}
                    year={watch('birthdateYear')}
                    onValueChange={field.onChange}
                    setValue={setValue}
                  />
                )}
              />
              <Controller
                name="birthdateMonth"
                control={control}
                render={({ field }) => (
                  <BrithdateMonth
                    day={watch('birthdateDay')}
                    month={watch('birthdateMonth')}
                    year={watch('birthdateYear')}
                    onValueChange={field.onChange}
                    setValue={setValue}
                  />
                )}
              />
              <Controller
                name="birthdateYear"
                control={control}
                render={({ field }) => (
                  <BirthdateYear
                    day={watch('birthdateDay')}
                    month={watch('birthdateMonth')}
                    year={watch('birthdateYear')}
                    onValueChange={field.onChange}
                    setValue={setValue}
                  />
                )}
              />
            </div>
            {(errors.birthdateDay || errors.birthdateMonth || errors.birthdateYear) && (
              <span className="text-sm text-red-600 font-semibold">
                {t('signup-edit.birthdate.too-small')}
              </span>
            )}
          </div>
          <DialogFooter>
            <Button
              disabled={loading}
              className="min-w-[85px]"
              loading={loading}
              type="submit"
            >
              {t('edit-profile.save')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
