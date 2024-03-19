'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useTranslations } from 'next-intl';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth } from '@/context/auth-context';
import { ProfilePicDialog } from '@/components/profile-pic-dialog';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { useUpdateProfile } from '@/hooks/useUpdateProfile';
import { useDeleteProfilePic } from '@/hooks/useDeleteProfilePic';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Info } from 'lucide-react';
import { useRouter } from '@/common/navigation';
import { useOriginTracker } from '@/context/origin-tracker';
import { SelectCity } from '@/components/select-city';

const editFormSchema = z.object({
  fullName: z.string().min(3).max(64),
  username: z
    .string()
    .min(3)
    .max(20)
    .regex(/^[a-zA-Z0-9_]+$/),
  cityId: z.number().optional(),
  birthdateDay: z.string().min(1),
  birthdateMonth: z.string().min(1),
  birthdateYear: z.string().min(1),
  bio: z.string().max(300),
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

const months = [
  'January',
  'February',
  'March',
  'May',
  'April',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const;

export default function EditProfile({ params }: { params: { slug: string } }) {
  const auth = useAuth();
  const [loading, setLoading] = useState<boolean>();
  const router = useRouter();
  const updateProfile = useUpdateProfile();
  const t = useTranslations();
  const deletePic = useDeleteProfilePic();
  const isWithinPage = useOriginTracker();
  const {
    watch,
    register,
    handleSubmit,
    control,
    setError,
    setValue,
    formState: { errors, isDirty },
  } = useForm<EditFormType>({
    resolver: zodResolver(editFormSchema),
    defaultValues: {
      username: auth.user?.username,
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
      formData.append('bio', data.bio);
      formData.append('username', data.username);
      data.cityId && formData.append('cityId', data.cityId.toString());

      const birthdate = new Date(
        +data.birthdateYear,
        +data.birthdateMonth,
        +data.birthdateDay,
      );

      formData.append('birthdate', birthdate.toISOString());
      await updateProfile.mutateAsync(formData);
      router.back();
    } catch (error: any) {
      error.response.data?.username?.code === 'username-not-available' &&
        setError('username', {
          message: t('signup.username.not-available'),
          type: 'username-not-available',
        });
    } finally {
      setLoading(false);
    }
  };

  const onOpenChange = () => {
    if (isDirty) {
      const shouldClose = window.confirm(t('modal.close'));
      if (!shouldClose) return;
    }

    isWithinPage
      ? router.back()
      : router.replace({ pathname: '/[slug]', params: { slug: params.slug } });
  };

  return (
    <Dialog open onOpenChange={onOpenChange}>
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
              <Label className="mr-1">{t('signup.name.label')}</Label>
              <Label className="text-muted-foreground text-xs">
                {watch('fullName')?.length || auth.user?.fullName.length || 0} / 64
              </Label>
            </div>
            <Input {...register('fullName')} />
            {errors.fullName && (
              <span className="text-sm text-red-600 font-semibold">
                {errors.fullName.type === 'too_big'
                  ? t('signup.name.max-length-error')
                  : t('signup.name.too-small')}
              </span>
            )}
          </div>
          <div>
            <div>
              <Label className="mr-1">{t('signup.username.label')}</Label>
              <Label className="text-muted-foreground text-xs">
                {watch('username')?.length || auth.user?.username.length || 0} / 20
              </Label>
            </div>
            <Input {...register('username')} />
            {errors.username &&
              (errors.username?.type === 'username-not-available' ? (
                <span className="text-red-600 text-sm font-semi-bold">
                  {t('signup.username.not-available')}
                </span>
              ) : (
                <span className="text-sm text-red-600 font-semibold">
                  {t('signup.username.valid-conditions.title')}
                  <ul className="list-disc ml-[18px]">
                    <li
                      data-valid={/.{3,20}/.test(watch('username'))}
                      className="data-[valid=true]:text-green-500"
                    >
                      {t('signup.username.valid-conditions.condition1')}
                    </li>
                    <li
                      data-valid={/^[a-zA-Z0-9_]+$/.test(watch('username'))}
                      className="data-[valid=true]:text-green-500"
                    >
                      {t('signup.username.valid-conditions.condition2')}
                    </li>
                  </ul>
                </span>
              ))}
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
                  onSelect={(value) => field.onChange(+value)}
                />
              )}
            />
            {errors.cityId && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info size={18} className="text-red-600" />
                </TooltipTrigger>
                <TooltipContent>{t('create-trip-diary.city-field-error')}</TooltipContent>
              </Tooltip>
            )}
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
            <Label>{t('signup.birthdate.label')}</Label>

            <div className="flex gap-2 justify-between">
              <Controller
                name="birthdateDay"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder={t('signup.day')} />
                    </SelectTrigger>
                    <SelectContent className="max-h-[400px]">
                      {[...Array(31)].map((_, index) => (
                        <SelectItem key={index + 1} value={(index + 1).toString()}>
                          {index + 1}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              <Controller
                name="birthdateMonth"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder={t('signup.month')} />
                    </SelectTrigger>
                    <SelectContent className="max-h-[400px]">
                      {months.map((month, index) => (
                        <SelectItem key={month} value={index.toString()}>
                          {t(`signup.months.${month}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              <Controller
                name="birthdateYear"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder={t('signup.year')} />
                    </SelectTrigger>
                    <SelectContent className="max-h-[400px]">
                      {Array.apply(0, Array(104 - 1))
                        .map((_, index) => new Date().getFullYear() - index - 16)
                        .map((year, index) => (
                          <SelectItem key={index} value={year.toString()}>
                            {year}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            {(errors.birthdateDay || errors.birthdateMonth || errors.birthdateYear) && (
              <span className="text-sm text-red-600 font-semibold">
                {t('signup.birthdate.too-small')}
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
}
