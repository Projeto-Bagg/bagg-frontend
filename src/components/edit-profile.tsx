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
import { Tooltip, TooltipTrigger } from '@/components/ui/tooltip';
import { Info } from 'lucide-react';

const editFormSchema = z
  .object({
    fullName: z.string().min(3).max(64),
    username: z
      .string()
      .min(3)
      .max(20)
      .regex(/^[a-zA-Z_]+$/),
    birthdateDay: z.string(),
    birthdateMonth: z.string(),
    birthdateYear: z.string(),
    bio: z.string(),
    profilePic: z
      .object({
        file: typeof window === 'undefined' ? z.any() : z.instanceof(File),
        url: z.string(),
      })
      .nullable(),
  })
  .partial();

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

export const EditProfile = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState<boolean>();
  const [loading, setLoading] = useState<boolean>();
  const editMutation = useEditProfile();
  const auth = useAuth();
  const t = useTranslations();
  const deletePic = useDeleteProfilePic();
  const edit = useForm<EditFormType>({
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
      data.fullName && formData.append('fullName', data.fullName);
      data.bio && formData.append('bio', data.bio);
      data.username && formData.append('username', data.username);

      let birthdate: Date | undefined;

      if (data.birthdateDay && data.birthdateMonth && data.birthdateYear) {
        birthdate = new Date(
          +data.birthdateYear,
          +data.birthdateMonth,
          +data.birthdateDay,
        );
      }

      birthdate && formData.append('birthdate', birthdate.toISOString());

      await editMutation.mutateAsync(formData);
      setOpen(false);
    } catch (error: any) {
      error.response.data?.username?.code === 'usernameNotAvailable' &&
        edit.setError('username', {
          message: t('signup.usernameNotAvailable'),
          type: 'usernameNotAvailable',
        });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open), edit.reset();
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('editProfile.title')}</DialogTitle>
          <DialogDescription>{t('editProfile.description')}</DialogDescription>
        </DialogHeader>
        <form onSubmit={edit.handleSubmit(handleEdit)}>
          <div className="mb-2">
            <ProfilePicDialog onSubmit={(f) => edit.setValue('profilePic', f)}>
              <div className="flex items-center gap-2.5 w-fit">
                <Avatar className="w-[72px] h-[72px]">
                  <AvatarFallback>
                    {auth.user?.fullName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                  <AvatarImage
                    src={
                      edit.watch('profilePic') === null
                        ? undefined
                        : edit.watch('profilePic')?.url || auth.user?.image
                    }
                  />
                </Avatar>
                <span className="text-sm font-bold text-blue-600">
                  {t('editProfile.editProfilePic')}
                </span>
              </div>
            </ProfilePicDialog>
          </div>
          <div className="mb-4">
            <div className="justify-between flex align-baseline mb-2">
              <Label>{t('signup.name')}</Label>
              {edit.formState.errors.fullName && (
                <span className="font-bold leading-none text-sm text-red-600">
                  {t('signup.nameError')}
                </span>
              )}
            </div>
            <Input {...edit.register('fullName')} defaultValue={auth.user?.fullName} />
          </div>
          <div className="mb-4">
            <div className="justify-between flex mb-2">
              <Label>{t('signup.username')}</Label>
              {edit.formState.errors.username && (
                <span className="font-bold leading-none text-sm text-red-600">
                  {edit.formState.errors.username.type === 'usernameNotAvailable' ? (
                    t('signup.usernameNotAvailable')
                  ) : (
                    <Tooltip>
                      <TooltipTrigger>
                        <Info />
                      </TooltipTrigger>
                    </Tooltip>
                  )}
                </span>
              )}
            </div>
            <Input {...edit.register('username')} defaultValue={auth.user?.username} />
          </div>
          <div className="mb-4">
            <div className="justify-between flex align-baseline mb-2">
              <Label>{t('editProfile.bio')}</Label>
            </div>
            <Textarea
              className="max-h-[144px]"
              {...edit.register('bio')}
              defaultValue={auth.user?.bio}
            />
          </div>
          <div className="mb-4">
            <div className="flex justify-between mb-2">
              <Label>{t('signup.birthdate')}</Label>
              {(edit.formState.errors.birthdateDay ||
                edit.formState.errors.birthdateMonth ||
                edit.formState.errors.birthdateYear) && (
                <span className="font-bold leading-none text-sm text-red-600">
                  {t('signup.birthdateError')}
                </span>
              )}
            </div>
            <div className="flex gap-2 justify-between">
              <Controller
                name="birthdateDay"
                control={edit.control}
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
                control={edit.control}
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
                control={edit.control}
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
};
