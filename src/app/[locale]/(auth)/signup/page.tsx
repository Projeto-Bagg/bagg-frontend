'use client';

import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { useAuth } from '@/context/auth-context';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useTranslations } from 'next-intl';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Link, useRouter } from '@/common/navigation';

const signUpSchema = z
  .object({
    fullName: z.string().min(3).max(64),
    username: z
      .string()
      .min(3)
      .max(20)
      .regex(/^[a-zA-Z0-9_]+$/),
    email: z.string().min(1).email(),
    birthdateDay: z.string().min(1),
    birthdateMonth: z.string().min(1),
    birthdateYear: z.string().min(1),
    password: z
      .string()
      .min(1)
      .regex(
        /^(?=(.*[a-z]){1,})(?=(.*[A-Z]){1,})(?=(.*[0-9]){1,})(?=(.*[-!$%^&*()_+|~=`{}\[\]:\/;<>?,.@#]){1,}).{8,}$/,
        'Password too weak',
      ),
    confirmPassword: z.string(),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({ code: 'custom', path: ['confirm-password'] });
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

export default function Page() {
  const auth = useAuth();
  const [loading, setLoading] = useState<boolean>();
  const router = useRouter();
  const t = useTranslations();
  const {
    control,
    formState: { errors },
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
        error.response.data?.email?.code === 'email-not-available' &&
          setError('email', {
            message: t('signup.email.not-available'),
            type: 'email-not-available',
          });
        error.response.data?.username?.code === 'username-not-available' &&
          setError('username', {
            message: t('signup.username.not-available'),
            type: 'username-not-available',
          });
        setLoading(false);
      });
  };

  return (
    <div className="p-4 max-w-xl m-auto my-8">
      <form
        id="signup-form"
        className="space-y-4 w-full h-full"
        onSubmit={handleSubmit(handleSignUp)}
      >
        <div className="flex mb-4 flex-col space-y-1.5 text-center sm:text-left">
          <h1 className="font-semibold tracking-tight text-2xl">{t('signup.title')}</h1>
          <p className="text-sm text-muted-foreground">{t('signup.description')}</p>
        </div>
        <div>
          <div>
            <Label className="mr-1">{t('signup.name.label')}</Label>
            <Label className="text-muted-foreground text-xs">
              {watch('fullName')?.length || 0} / 64
            </Label>
          </div>
          <Input id="fullName" {...register('fullName')} />
          {errors.fullName && (
            <span className="text-sm text-red-600 font-semibold">
              {errors.fullName.type === 'too_big'
                ? t('signup.name.max-length-error')
                : t('signup.name.too-small')}
            </span>
          )}
        </div>
        <div>
          <div className="flex items-end gap-1">
            <Label>{t('signup.username.label')}</Label>
            <Label className="text-muted-foreground text-xs">
              {watch('username')?.length || 0} / 20
            </Label>
          </div>
          <Input id="username" {...register('username')} />
          {errors.username && (
            <span className="text-red-600 text-sm font-semibold">
              {errors.username?.type === 'username-not-available' ? (
                t('signup.username.not-available')
              ) : errors.username.type === 'too_small' ? (
                t('signup.username.too-small')
              ) : (
                <>
                  {t('signup.username.valid-conditions.title')}
                  <ul className="list-disc ml-[18px]">
                    <li
                      data-valid={/^.{3,20}$/.test(watch('username'))}
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
                </>
              )}
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
                <Select onValueChange={field.onChange}>
                  <SelectTrigger id="birthdateDay">
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
                  <SelectTrigger id="birthdateMonth">
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
                  <SelectTrigger id="birthdateYear">
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
        <div>
          <Label>{t('signup.email.label')}</Label>
          <Input id="email" {...register('email')} />
          {errors.email && (
            <span className="text-sm text-red-600 font-semibold">
              {errors.email.type === 'email-not-available'
                ? t('signup.email.not-available')
                : errors.email.type === 'too_small'
                ? t('signup.email.too-small')
                : t('signup.email.invalid')}
            </span>
          )}
        </div>
        <div>
          <Label>{t('signup.password.label')}</Label>
          <Input id="password" type={'password'} {...register('password')} />
          {errors.password && (
            <span className="text-sm text-red-600 font-semibold">
              {errors.password.type === 'too_small' ? (
                t('signup.password.too-small')
              ) : (
                <>
                  <span>{t('signup.password.valid-conditions.title')}</span>
                  <ul className="list-disc ml-[18px]">
                    <li
                      data-valid={/.{8,}/.test(watch('password'))}
                      className="data-[valid=true]:text-green-500"
                    >
                      {t('signup.password.valid-conditions.condition1')}
                    </li>
                    <li
                      data-valid={/(?=(.*[0-9]){1,})/.test(watch('password'))}
                      className="data-[valid=true]:text-green-500"
                    >
                      {t('signup.password.valid-conditions.condition2')}
                    </li>
                    <li
                      data-valid={/(?=(.*[a-z]){1,})(?=(.*[A-Z]){1,})/.test(
                        watch('password'),
                      )}
                      className="data-[valid=true]:text-green-500"
                    >
                      {t('signup.password.valid-conditions.condition3')}
                    </li>
                    <li
                      data-valid={/(?=(.*[-!$%^&*()_+|~=`{}\[\]:\/;<>?,.@#]){1,})/.test(
                        watch('password'),
                      )}
                      className="data-[valid=true]:text-green-500"
                    >
                      {t('signup.password.valid-conditions.condition4', {
                        characters: '!@#$%&*()-_=+<>:;/|,.^`}{[]',
                      })}
                    </li>
                  </ul>
                </>
              )}
            </span>
          )}
        </div>
        <div>
          <Label>{t('signup.confirm-password.label')}</Label>
          <Input
            id="confirmPassword"
            type={'password'}
            {...register('confirmPassword')}
          />
          {errors.confirmPassword && (
            <span className="text-sm text-red-500 font-bold">
              {t('signup.confirm-password.unmatched-passwords')}
            </span>
          )}
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
      <div className="flex text-sm justify-center mt-4">
        <span>
          {t('signup.login-redirect.title')}{' '}
          <Link
            id="redirect-login"
            replace
            className="text-primary hover:underline"
            href={'/login'}
          >
            {t('signup.login-redirect.link')}
          </Link>
        </span>
      </div>
    </div>
  );
}
