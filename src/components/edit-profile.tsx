'use client';

import React, { useState } from 'react';
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
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { useEditProfile } from '@/hooks/useEditProfile';

const editFormSchema = z
  .object({
    fullName: z.string(),
    username: z.string(),
    birthdateDay: z.string(),
    birthdateMonth: z.string(),
    birthdateYear: z.string(),
    bio: z.string(),
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

export const EditProfile = () => {
  const [open, setOpen] = useState<boolean>();
  const [loading, setLoading] = useState<boolean>();
  const edit = useForm<EditFormType>({
    resolver: zodResolver(editFormSchema),
  });

  const auth = useAuth();

  const t = useTranslations();

  const editMutation = useEditProfile();

  const handleEdit = async (data: EditFormType) => {
    try {
      setLoading(true);

      const { birthdateDay, birthdateMonth, birthdateYear, ...signUpData } = data;

      let birthdate;

      if (birthdateDay && birthdateMonth && birthdateYear) {
        birthdate = new Date(+birthdateYear, +birthdateMonth, +birthdateDay);
      }

      await editMutation.mutateAsync({ ...signUpData, birthdate });
      setOpen(false);
    } catch (error: any) {
      error.response.data?.username?.code === 'username_not_available' &&
        edit.setError('username', {
          message: t('signup.username_not_available'),
          type: 'username_not_available',
        });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>{t('edit_profile.button')}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('edit_profile.title')}</DialogTitle>
          <DialogDescription>{t('edit_profile.description')}</DialogDescription>
        </DialogHeader>
        <form onSubmit={edit.handleSubmit(handleEdit)}>
          <div className="mb-2">
            <ProfilePicDialog>
              <div className="flex items-center gap-2.5 w-fit">
                <Avatar>
                  <AvatarImage src={auth.user?.image} />
                </Avatar>
                <span className="text-sm font-bold text-blue-600">
                  {t('edit_profile.edit_profile_pic')}
                </span>
              </div>
            </ProfilePicDialog>
          </div>
          <div className="mb-4">
            <div className="justify-between flex align-baseline mb-2">
              <Label>{t('signup.name')}</Label>
              {edit.formState.errors.fullName && (
                <span className="font-bold leading-none text-sm text-red-600">
                  {t('signup.name_error')}
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
                  {edit.formState.errors.username.type === 'username_not_available'
                    ? t('signup.username_not_available')
                    : t('signup.username_error')}
                </span>
              )}
            </div>
            <Input {...edit.register('username')} defaultValue={auth.user?.username} />
          </div>
          <div className="mb-4">
            <div className="justify-between flex align-baseline mb-2">
              <Label>{t('edit_profile.bio')}</Label>
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
                  {t('signup.birthdate_error')}
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
                      {Array.apply(0, Array(120 - 1))
                        .map((_, index) => new Date().getFullYear() - index)
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
              {t('edit_profile.save')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
