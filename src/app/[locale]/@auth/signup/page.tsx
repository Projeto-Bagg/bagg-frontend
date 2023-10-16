'use client';

import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { useAuth } from '@/context/auth-context';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useTranslations } from 'next-intl';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useRouter } from 'next/navigation';
import { useOriginTracker } from '@/context/origin-tracker';

const signUpSchema = z
  .object({
    fullName: z.string().min(3).max(64),
    username: z.string().min(3).max(15),
    email: z.string().email(),
    birthdateDay: z.string(),
    birthdateMonth: z.string(),
    birthdateYear: z.string(),
    password: z
      .string()
      .min(4)
      .regex(
        /^(?=(.*[a-z]){1,})(?=(.*[A-Z]){1,})(?=(.*[0-9]){1,})(?=(.*[!@#$%^&*()\-__+.]){1,}).{8,}$/,
        'password_too_weak',
      ),
    confirmPassword: z.string(),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({ code: 'custom', path: ['confirmPassword'] });
    }
  });

type SignUpType = z.infer<typeof signUpSchema>;

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

export default function SignUp() {
  const [loading, setLoading] = useState<boolean>();
  const auth = useAuth();
  const router = useRouter();
  const t = useTranslations('signup');
  const isWithinPage = useOriginTracker();

  const signUp = useForm<SignUpType>({
    resolver: zodResolver(signUpSchema),
  });

  const handleSignUp = async (data: SignUpType) => {
    try {
      setLoading(true);

      const {
        confirmPassword,
        birthdateDay,
        birthdateMonth,
        birthdateYear,
        ...signUpData
      } = data;

      const birthdate = new Date(+birthdateYear, +birthdateMonth, +birthdateDay);

      await auth.signUp({
        ...signUpData,
        birthdate,
        fullName: data.fullName.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase()),
      });

      await new Promise((resolve) => setTimeout(resolve, 700));

      await auth.login({ login: data.username, password: data.password });

      router.back();
    } catch (error: any) {
      error.response.data?.email?.code === 'email_not_available' &&
        signUp.setError('email', {
          message: t('email_not_available'),
          type: 'email_not_available',
        });
      error.response.data?.username?.code === 'username_not_available' &&
        signUp.setError('username', {
          message: t('username_not_available'),
          type: 'username_not_available',
        });
      setLoading(false);
    }
  };

  return (
    <Dialog
      open
      onOpenChange={() =>
        isWithinPage
          ? router.back()
          : router.push('/', { forceOptimisticNavigation: true } as any)
      }
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-2xl">{t('title')}</DialogTitle>
          <DialogDescription>{t('description')}</DialogDescription>
        </DialogHeader>
        <form onSubmit={signUp.handleSubmit(handleSignUp)}>
          <div className="mb-4">
            <div className="justify-between flex align-baseline mb-2">
              <Label>{t('name')}</Label>
              {signUp.formState.errors.fullName && (
                <span className="font-bold leading-none text-sm text-red-600">
                  {t('name_error')}
                </span>
              )}
            </div>
            <Input {...signUp.register('fullName')} />
          </div>
          <div className="mb-4">
            <div className="justify-between flex mb-2">
              <Label>{t('username')}</Label>
              {signUp.formState.errors.username && (
                <span className="font-bold leading-none text-sm text-red-600">
                  {signUp.formState.errors.username.type === 'username_not_available'
                    ? t('username_not_available')
                    : t('username_error')}
                </span>
              )}
            </div>
            <Input {...signUp.register('username')} />
          </div>
          <div className="mb-4">
            <div className="flex justify-between mb-2">
              <Label>{t('birthdate')}</Label>
              {(signUp.formState.errors.birthdateDay ||
                signUp.formState.errors.birthdateMonth ||
                signUp.formState.errors.birthdateYear) && (
                <span className="font-bold leading-none text-sm text-red-600">
                  {t('birthdate_error')}
                </span>
              )}
            </div>
            <div className="flex gap-2 justify-between">
              <Controller
                name="birthdateDay"
                control={signUp.control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder={t('day')} />
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
                control={signUp.control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder={t('month')} />
                    </SelectTrigger>
                    <SelectContent className="max-h-[400px]">
                      {months.map((month, index) => (
                        <SelectItem key={month} value={index.toString()}>
                          {t(`months.${month}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              <Controller
                name="birthdateYear"
                control={signUp.control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder={t('year')} />
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
          <div className="mb-4">
            <div className="flex justify-between mb-2">
              <Label>{t('email')}</Label>
              {signUp.formState.errors.email && (
                <span className="font-bold leading-none text-sm text-red-600">
                  {signUp.formState.errors.email.type === 'email_not_available'
                    ? t('email_not_available')
                    : t('email_error')}
                </span>
              )}
            </div>
            <Input {...signUp.register('email')} />
          </div>
          <div className="mb-4">
            <div className="flex justify-between mb-2">
              <Label>{t('password')}</Label>
              {signUp.formState.errors.password && (
                <span className="font-bold leading-none text-sm text-red-600">
                  {signUp.formState.errors.password.message === 'password_too_weak'
                    ? t('password_too_weak')
                    : t('password_error')}
                </span>
              )}
            </div>
            <Input type={'password'} {...signUp.register('password')} />
          </div>
          <div className="mb-4">
            <div className="flex justify-between mb-2">
              <Label>{t('confirm_password')}</Label>
              {signUp.formState.errors.confirmPassword && (
                <span className="font-bold leading-none text-sm text-red-600">
                  {t('confirm_password_error')}
                </span>
              )}
            </div>
            <Input type={'password'} {...signUp.register('confirmPassword')} />
          </div>
          <span className="text-center block mb-4 text-sm font-medium text-muted-foreground">
            {t('confirm')}
          </span>
          <div className="flex justify-end mb-2">
            <Button type={'submit'} loading={loading} className="w-full">
              {t('signup')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
