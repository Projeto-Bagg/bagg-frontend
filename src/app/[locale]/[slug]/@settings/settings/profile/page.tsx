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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { useEditProfile } from '@/hooks/useEditProfile';
import { useDeleteProfilePic } from '@/hooks/useDeleteProfilePic';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Info } from 'lucide-react';
import { useRouter } from 'next-intl/client';
import { useOriginTracker } from '@/context/origin-tracker';

const editFormSchema = z.object({
  fullName: z.string().min(3).max(64),
  username: z
    .string()
    .min(3)
    .max(20)
    .regex(/^[a-zA-Z0-9_]+$/),
  birthdateDay: z.string(),
  birthdateMonth: z.string(),
  birthdateYear: z.string(),
  bio: z.string().max(300),
  profilePic: z
    .object({
      file: typeof window === 'undefined' ? z.any() : z.instanceof(File),
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
  const editMutation = useEditProfile();
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
    formState: { errors },
  } = useForm<EditFormType>({
    resolver: zodResolver(editFormSchema),
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

      const birthdate = new Date(
        +data.birthdateYear,
        +data.birthdateMonth,
        +data.birthdateDay,
      );

      formData.append('birthdate', birthdate.toISOString());
      await editMutation.mutateAsync(formData);
      router.back();
    } catch (error: any) {
      error.response.data?.username?.code === 'usernameNotAvailable' &&
        setError('username', {
          message: t('signup.usernameNotAvailable'),
          type: 'usernameNotAvailable',
        });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open
      onOpenChange={() => {
        isWithinPage
          ? router.back()
          : router.push('/' + params.slug, { forceOptimisticNavigation: true } as any);
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('editProfile.title')}</DialogTitle>
          <DialogDescription>{t('editProfile.description')}</DialogDescription>
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
                  {t('editProfile.editProfilePic')}
                </span>
              </div>
            </ProfilePicDialog>
          </div>
          <div>
            <div className="justify-between flex mb-0.5">
              <div className="flex items-end gap-1">
                <Label>{t('signup.name')}</Label>
                <Label className="text-muted-foreground text-xs">
                  {watch('fullName')?.length || auth.user?.fullName.length || 0} / 64
                </Label>
              </div>
              {errors.fullName && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info size={18} className="text-red-600" />
                  </TooltipTrigger>
                  <TooltipContent>
                    {errors.fullName.type === 'too_big'
                      ? t('signup.nameSizeError')
                      : t('signup.nameError')}
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
            <Input {...register('fullName')} defaultValue={auth.user?.fullName} />
          </div>
          <div>
            <div className="justify-between flex mb-0.5">
              <div className="flex items-end gap-1">
                <Label>{t('signup.username')}</Label>
                <Label className="text-muted-foreground text-xs">
                  {watch('username')?.length || auth.user?.username.length || 0} / 20
                </Label>
              </div>
              {errors.username &&
                (errors.username?.type === 'usernameNotAvailable' ? (
                  <span className="text-red-500 text-sm font-bold">
                    {t('signup.usernameNotAvailable')}
                  </span>
                ) : (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info size={18} className="text-red-600" />
                    </TooltipTrigger>
                    <TooltipContent className="pl-7">
                      {t('signup.usernameError.title')}
                      <ul className="list-disc">
                        <li
                          data-valid={/.{3,20}/.test(watch('username'))}
                          className="data-[valid=true]:text-green-500"
                        >
                          {t('signup.usernameError.condition1')}
                        </li>
                        <li
                          data-valid={/^[a-zA-Z0-9_]+$/.test(watch('username'))}
                          className="data-[valid=true]:text-green-500"
                        >
                          {t('signup.usernameError.condition2')}
                        </li>
                      </ul>
                    </TooltipContent>
                  </Tooltip>
                ))}
            </div>
            <Input {...register('username')} defaultValue={auth.user?.username} />
          </div>
          <div>
            <div className="justify-between flex mb-0.5">
              <div className="flex gap-2 items-end">
                <Label>{t('editProfile.bio')}</Label>
                <Label className="text-muted-foreground text-xs">
                  {watch('bio')?.length || auth.user?.bio?.length || 0} / 300
                </Label>
              </div>
              {errors.bio && (
                <Tooltip>
                  <TooltipTrigger>
                    <Info size={18} className="text-red-600" />
                  </TooltipTrigger>
                  <TooltipContent>{t('editProfile.bioSizeError')}</TooltipContent>
                </Tooltip>
              )}
            </div>
            <Textarea
              className="max-h-[144px]"
              {...register('bio')}
              defaultValue={auth.user?.bio}
            />
          </div>
          <div>
            <div className="flex justify-between mb-0.5">
              <Label>{t('signup.birthdate')}</Label>
              {(errors.birthdateDay || errors.birthdateMonth || errors.birthdateYear) && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info size={18} className="text-red-600" />
                  </TooltipTrigger>
                  <TooltipContent>{t('signup.birthdateError')}</TooltipContent>
                </Tooltip>
              )}
            </div>
            <div className="flex gap-2 justify-between">
              <Controller
                name="birthdateDay"
                control={control}
                defaultValue={auth.user?.birthdate.getDate().toString()}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={auth.user?.birthdate.getDate().toString()}
                  >
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
                defaultValue={auth.user?.birthdate.getMonth().toString()}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={auth.user?.birthdate.getMonth().toString()}
                  >
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
                defaultValue={auth.user?.birthdate.getFullYear().toString()}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={auth.user?.birthdate.getFullYear().toString()}
                  >
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
          </div>
          <DialogFooter>
            <Button className="min-w-[85px]" loading={loading} type="submit">
              {t('editProfile.save')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
