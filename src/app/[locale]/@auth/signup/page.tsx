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
import { useOriginTracker } from '@/context/origin-tracker';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Info } from 'lucide-react';
import { useRouter } from '@/common/navigation';

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
  const auth = useAuth();
  const [loading, setLoading] = useState<boolean>();
  const router = useRouter();
  const t = useTranslations();
  const isWithinPage = useOriginTracker();
  const {
    control,
    formState: { isDirty, errors },
    setError,
    register,
    handleSubmit,
    watch,
  } = useForm<SignUpType>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      confirmPassword: '',
      email: '',
      fullName: '',
      password: '',
      username: '',
      birthdateDay: '',
      birthdateMonth: '',
      birthdateYear: '',
    },
  });

  const handleSignUp = async (data: SignUpType) => {
    setLoading(true);

    const {
      confirmPassword,
      birthdateDay,
      birthdateMonth,
      birthdateYear,
      ...signUpData
    } = data;

    const birthdate = new Date(+birthdateYear, +birthdateMonth, +birthdateDay);

    await auth
      .signUp({
        ...signUpData,
        birthdate,
        fullName: data.fullName.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase()),
      })
      .then(async () => {
        await new Promise((resolve) => setTimeout(resolve, 700));

        await auth.login({ login: data.username, password: data.password });

        router.back();
      })
      .catch((error) => {
        error.response.data?.email?.code === 'emailNotAvailable' &&
          setError('email', {
            message: t('signup.emailNotAvailable'),
            type: 'emailNotAvailable',
          });
        error.response.data?.username?.code === 'usernameNotAvailable' &&
          setError('username', {
            message: t('signup.usernameNotAvailable'),
            type: 'usernameNotAvailable',
          });
        setLoading(false);
      });
  };

  const onOpenChange = () => {
    if (isDirty) {
      const shouldClose = window.confirm(t('modal.close'));
      if (!shouldClose) return;
    }

    isWithinPage ? router.back() : router.replace({ pathname: '/' });
  };

  return (
    <Dialog open onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-2xl">{t('signup.title')}</DialogTitle>
          <DialogDescription>{t('signup.description')}</DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit(handleSignUp)}>
          <div>
            <div className="justify-between flex mb-0.5">
              <div className="flex items-end gap-1">
                <Label>{t('signup.name')}</Label>
                <Label className="text-muted-foreground text-xs">
                  {watch('fullName')?.length || 0} / 64
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
            <Input {...register('fullName')} />
          </div>
          <div>
            <div className="justify-between flex mb-0.5">
              <div className="flex items-end gap-1">
                <Label>{t('signup.username')}</Label>
                <Label className="text-muted-foreground text-xs">
                  {watch('username')?.length || 0} / 20
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
                          data-valid={/^.{3,20}$/.test(watch('username'))}
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
            <Input {...register('username')} />
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
                render={({ field }) => (
                  <Select onValueChange={field.onChange}>
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
                  <Select onValueChange={field.onChange}>
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
                  <Select onValueChange={field.onChange}>
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
          <div>
            <div className="flex justify-between mb-0.5">
              <Label>{t('signup.email')}</Label>
              {errors.email &&
                (errors.email.type === 'emailNotAvailable' ? (
                  <span className="text-sm text-red-500 font-bold">
                    {t('signup.emailNotAvailable')}
                  </span>
                ) : (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info size={18} className="text-red-600" />
                    </TooltipTrigger>
                    <TooltipContent>{t('signup.emailError')}</TooltipContent>
                  </Tooltip>
                ))}
            </div>
            <Input {...register('email')} />
          </div>
          <div>
            <div className="flex justify-between mb-0.5">
              <Label>{t('signup.password')}</Label>
              {errors.password && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info size={18} className="text-red-600" />
                  </TooltipTrigger>
                  <TooltipContent className="pl-7">
                    <span>{t('signup.passwordTooWeak.title')}</span>
                    <ul className="list-disc">
                      <li
                        data-valid={/.{8,}/.test(watch('password'))}
                        className="data-[valid=true]:text-green-500"
                      >
                        {t('signup.passwordTooWeak.condition1')}
                      </li>
                      <li
                        data-valid={/(?=(.*[0-9]){1,})/.test(watch('password'))}
                        className="data-[valid=true]:text-green-500"
                      >
                        {t('signup.passwordTooWeak.condition2')}
                      </li>
                      <li
                        data-valid={/(?=(.*[a-z]){1,})(?=(.*[A-Z]){1,})/.test(
                          watch('password'),
                        )}
                        className="data-[valid=true]:text-green-500"
                      >
                        {t('signup.passwordTooWeak.condition3')}
                      </li>
                      <li
                        data-valid={/(?=(.*[-!$%^&*()_+|~=`{}\[\]:\/;<>?,.@#]){1,})/.test(
                          watch('password'),
                        )}
                        className="data-[valid=true]:text-green-500"
                      >
                        {t('signup.passwordTooWeak.condition4', {
                          characters: '!@#$%&*()-_=+<>:;/|,.^`}{[]',
                        })}
                      </li>
                    </ul>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
            <Input type={'password'} {...register('password')} />
          </div>
          <div>
            <div className="flex justify-between mb-0.5">
              <Label>{t('signup.confirmPassword')}</Label>
              {errors.confirmPassword && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info size={18} className="text-red-600" />
                  </TooltipTrigger>
                  <TooltipContent>{t('signup.confirmPasswordError')}</TooltipContent>
                </Tooltip>
              )}
            </div>
            <Input type={'password'} {...register('confirmPassword')} />
          </div>
          <span className="text-center block text-sm font-medium text-muted-foreground">
            {t('signup.confirm')}
          </span>
          <div className="flex justify-end mb-2">
            <Button type={'submit'} loading={loading} className="w-full">
              {t('signup.signup')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
