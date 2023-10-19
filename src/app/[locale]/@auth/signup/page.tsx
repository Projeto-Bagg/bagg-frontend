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
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Info } from 'lucide-react';

const signUpSchema = z
  .object({
    fullName: z.string().min(3).max(64),
    username: z
      .string()
      .min(3)
      .max(20)
      .regex(/^[a-zA-Z0-9_]+$/),
    email: z.string().email(),
    birthdateDay: z.string(),
    birthdateMonth: z.string(),
    birthdateYear: z.string(),
    password: z
      .string()
      .regex(
        /^(?=(.*[a-z]){1,})(?=(.*[A-Z]){1,})(?=(.*[0-9]){1,})(?=(.*[-!$%^&*()_+|~=`{}\[\]:\/;<>?,.@#]){1,}).{8,}$/,
        'Password too weak',
      )
      .min(8),
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
      error.response.data?.email?.code === 'emailNotAvailable' &&
        signUp.setError('email', {
          message: t('emailNotAvailable'),
          type: 'emailNotAvailable',
        });
      error.response.data?.username?.code === 'usernameNotAvailable' &&
        signUp.setError('username', {
          message: t('usernameNotAvailable'),
          type: 'usernameNotAvailable',
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
      <DialogContent onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="text-2xl">{t('title')}</DialogTitle>
          <DialogDescription>{t('description')}</DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={signUp.handleSubmit(handleSignUp)}>
          <div>
            <div className="justify-between flex mb-0.5">
              <Label>{t('name')}</Label>
              {signUp.formState.errors.fullName && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info size={18} className="text-red-600" />
                  </TooltipTrigger>
                  <TooltipContent>{t('nameError')}</TooltipContent>
                </Tooltip>
              )}
            </div>
            <Input {...signUp.register('fullName')} />
          </div>
          <div>
            <div className="justify-between flex mb-0.5">
              <Label>{t('username')}</Label>
              {signUp.formState.errors.username &&
                (signUp.formState.errors.username?.type === 'usernameNotAvailable' ? (
                  <span className="text-red-500 text-sm font-bold">
                    {t('usernameNotAvailable')}
                  </span>
                ) : (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info size={18} className="text-red-600" />
                    </TooltipTrigger>
                    <TooltipContent className="pl-7">
                      {t('usernameError.title')}
                      <ul className="list-disc">
                        <li
                          data-valid={/.{3,20}/.test(signUp.watch('username'))}
                          className="data-[valid=true]:text-green-500"
                        >
                          {t('usernameError.condition1')}
                        </li>
                        <li
                          data-valid={/^[a-zA-Z0-9_]+$/.test(signUp.watch('username'))}
                          className="data-[valid=true]:text-green-500"
                        >
                          {t('usernameError.condition2')}
                        </li>
                      </ul>
                    </TooltipContent>
                  </Tooltip>
                ))}
            </div>
            <Input {...signUp.register('username')} />
          </div>
          <div>
            <div className="flex justify-between mb-0.5">
              <Label>{t('birthdate')}</Label>
              {(signUp.formState.errors.birthdateDay ||
                signUp.formState.errors.birthdateMonth ||
                signUp.formState.errors.birthdateYear) && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info size={18} className="text-red-600" />
                  </TooltipTrigger>
                  <TooltipContent>{t('birthdateError')}</TooltipContent>
                </Tooltip>
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
          <div>
            <div className="flex justify-between mb-0.5">
              <Label>{t('email')}</Label>
              {signUp.formState.errors.email &&
                (signUp.formState.errors.email.type === 'emailNotAvailable' ? (
                  <span className="text-sm text-red-500 font-bold">
                    {t('emailNotAvailable')}
                  </span>
                ) : (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info size={18} className="text-red-600" />
                    </TooltipTrigger>
                    <TooltipContent>{t('emailError')}</TooltipContent>
                  </Tooltip>
                ))}
            </div>
            <Input {...signUp.register('email')} />
          </div>
          <div>
            <div className="flex justify-between mb-0.5">
              <Label>{t('password')}</Label>
              {signUp.formState.errors.password && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info size={18} className="text-red-600" />
                  </TooltipTrigger>
                  <TooltipContent className="pl-7">
                    <span>{t('passwordTooWeak.title')}</span>
                    <ul className="list-disc">
                      <li
                        data-valid={/.{8,}/.test(signUp.watch('password'))}
                        className="data-[valid=true]:text-green-500"
                      >
                        {t('passwordTooWeak.condition1')}
                      </li>
                      <li
                        data-valid={/(?=(.*[0-9]){1,})/.test(signUp.watch('password'))}
                        className="data-[valid=true]:text-green-500"
                      >
                        {t('passwordTooWeak.condition2')}
                      </li>
                      <li
                        data-valid={/(?=(.*[a-z]){1,})(?=(.*[A-Z]){1,})/.test(
                          signUp.watch('password'),
                        )}
                        className="data-[valid=true]:text-green-500"
                      >
                        {t('passwordTooWeak.condition3')}
                      </li>
                      <li
                        data-valid={/(?=(.*[-!$%^&*()_+|~=`{}\[\]:\/;<>?,.@#]){1,})/.test(
                          signUp.watch('password'),
                        )}
                        className="data-[valid=true]:text-green-500"
                      >
                        {t('passwordTooWeak.condition4', {
                          characters: '!@#$%&*()-_=+<>:;/|,.^`}{[]',
                        })}
                      </li>
                    </ul>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
            <Input type={'password'} {...signUp.register('password')} />
          </div>
          <div>
            <div className="flex justify-between mb-0.5">
              <Label>{t('confirmPassword')}</Label>
              {signUp.formState.errors.confirmPassword && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info size={18} className="text-red-600" />
                  </TooltipTrigger>
                  <TooltipContent>{t('confirmPasswordError')}</TooltipContent>
                </Tooltip>
              )}
            </div>
            <Input type={'password'} {...signUp.register('confirmPassword')} />
          </div>
          <span className="text-center block text-sm font-medium text-muted-foreground">
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
