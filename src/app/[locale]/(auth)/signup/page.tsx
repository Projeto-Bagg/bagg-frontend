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
import { useDebounce } from 'use-debounce';
import { useQuery } from '@tanstack/react-query';
import axios from '@/services/axios';
import { getDaysInMonth } from 'date-fns';
import { months } from '@/common/months';
import {
  isDayAvailable,
  isMonthAvailable,
} from '@/app/[locale]/(auth)/signup/birthdate-validation';

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
      ctx.addIssue({ code: 'custom', path: ['confirmPassword'] });
    }
  });

type SignUpType = z.infer<typeof signUpSchema>;

export default function Page() {
  const auth = useAuth();
  const [loading, setLoading] = useState<boolean>();
  const router = useRouter();
  const t = useTranslations();
  const {
    control,
    formState: { errors },
    register,
    handleSubmit,
    getValues,
    setValue,
    watch,
  } = useForm<SignUpType>({
    resolver: zodResolver(signUpSchema),
    mode: 'onChange',
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

  const username = watch().username;
  const [debouncedUsername] = useDebounce(username, 1000);
  const isUsernameAvailable = useQuery({
    queryFn: () => axios.get(`users/username-availability/${debouncedUsername}`),
    queryKey: ['username-availability', debouncedUsername],
    enabled: !!debouncedUsername && username.length >= 3,
  });

  const email = watch().email;
  const [debouncedQuery] = useDebounce(email, 1000);
  const isEmailAvailable = useQuery({
    queryFn: () => axios.get(`users/email-availability/${debouncedQuery}`),
    queryKey: ['email-availability', debouncedQuery],
    enabled:
      !!debouncedQuery && debouncedQuery.includes('@') && debouncedQuery.includes('.'),
  });

  const handleSignUp = async (data: SignUpType) => {
    if (isUsernameAvailable.isError || isEmailAvailable.isError) {
      return;
    }

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
      .catch(() => {
        setLoading(false);
      });
  };

  return (
    <div className="p-4 max-w-xl m-auto my-8">
      <form
        data-test="signup-form"
        className="space-y-4 w-full h-full"
        onSubmit={handleSubmit(handleSignUp)}
      >
        <div className="flex mb-4 flex-col space-y-1.5 text-center sm:text-left">
          <h1 className="font-semibold tracking-tight text-2xl">
            {t('signup-edit.title')}
          </h1>
          <p className="text-sm text-muted-foreground">{t('signup-edit.description')}</p>
        </div>
        <div>
          <div>
            <Label className="mr-1">{t('signup-edit.name.label')}</Label>
            <Label className="text-muted-foreground text-xs">
              {watch('fullName')?.length || 0} / 64
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
          <div className="flex items-end gap-1">
            <Label>{t('signup-edit.username.label')}</Label>
            <Label className="text-muted-foreground text-xs">
              {watch('username')?.length || 0} / 20
            </Label>
          </div>
          <Input {...register('username')} />
          {!errors.username && (
            <>
              {isUsernameAvailable.isError && (
                <span
                  data-test="username-not-available"
                  className="text-sm text-red-600 font-semibold"
                >
                  {t('signup-edit.username.not-available')}
                </span>
              )}
              {isUsernameAvailable.isSuccess && (
                <span
                  data-test="username-available"
                  className="text-sm text-green-500 font-semibold"
                >
                  {t('signup-edit.username.available')}
                </span>
              )}
            </>
          )}
          {errors.username && (
            <span className="text-red-600 text-sm font-semibold">
              {errors.username.type === 'too_small' ? (
                t('signup-edit.username.too-small')
              ) : (
                <>
                  {t('signup-edit.username.valid-conditions.title')}
                  <ul className="list-disc ml-[18px]">
                    <li
                      data-valid={/^.{3,20}$/.test(watch('username'))}
                      className="data-[valid=true]:text-green-500"
                    >
                      {t('signup-edit.username.valid-conditions.condition1')}
                    </li>
                    <li
                      data-valid={/^[a-zA-Z0-9_]+$/.test(watch('username'))}
                      className="data-[valid=true]:text-green-500"
                    >
                      {t('signup-edit.username.valid-conditions.condition2')}
                    </li>
                  </ul>
                </>
              )}
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
                <Select
                  value={watch('birthdateDay')}
                  onValueChange={(value) => {
                    field.onChange(value);

                    const currentMonth = getValues('birthdateMonth');
                    if (!isMonthAvailable(+currentMonth, +watch('birthdateYear'))) {
                      setValue('birthdateMonth', '');
                    }
                  }}
                >
                  <SelectTrigger data-test="birthdate-day">
                    <SelectValue placeholder={t('signup-edit.day')} />
                  </SelectTrigger>
                  <SelectContent className="max-h-[400px]">
                    {[
                      ...Array(
                        getDaysInMonth(
                          new Date(+watch('birthdateYear'), +watch('birthdateMonth')),
                        ),
                      ),
                    ].map((_, index) => (
                      <SelectItem
                        disabled={
                          !isDayAvailable(
                            index + 1,
                            +watch('birthdateMonth'),
                            +watch('birthdateYear'),
                          )
                        }
                        key={index + 1}
                        value={(index + 1).toString()}
                      >
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
                <Select
                  value={watch('birthdateMonth')}
                  onValueChange={(value) => {
                    field.onChange(value);

                    const currentDay = getValues('birthdateDay');
                    if (
                      !isDayAvailable(
                        +currentDay,
                        +watch('birthdateMonth'),
                        +watch('birthdateYear'),
                      )
                    ) {
                      setValue('birthdateDay', '');
                    }
                  }}
                >
                  <SelectTrigger data-test="birthdate-month">
                    <SelectValue placeholder={t('signup-edit.month')} />
                  </SelectTrigger>
                  <SelectContent className="max-h-[400px]">
                    {months.map((month, index) => (
                      <SelectItem
                        disabled={!isMonthAvailable(index, +watch('birthdateYear'))}
                        key={month}
                        value={index.toString()}
                      >
                        {t(`signup-edit.months.${month}`)}
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
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);

                    const currentDay = getValues('birthdateDay');
                    if (
                      !isDayAvailable(
                        +currentDay,
                        +watch('birthdateMonth'),
                        +watch('birthdateYear'),
                      )
                    ) {
                      setValue('birthdateDay', '');
                    }

                    const currentMonth = getValues('birthdateMonth');
                    if (!isMonthAvailable(+currentMonth, +watch('birthdateYear'))) {
                      setValue('birthdateMonth', '');
                    }
                  }}
                >
                  <SelectTrigger data-test="birthdate-year">
                    <SelectValue placeholder={t('signup-edit.year')} />
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
            <span
              data-test="birthdate-too-small"
              className="text-sm text-red-600 font-semibold"
            >
              {t('signup-edit.birthdate.too-small')}
            </span>
          )}
        </div>
        <div>
          <Label>{t('signup-edit.email.label')}</Label>
          <Input {...register('email')} />
          {!errors.email && (
            <>
              {isEmailAvailable.isError && (
                <span
                  data-test="email-not-available"
                  className="text-sm text-red-600 font-semibold"
                >
                  {t('signup-edit.email.not-available')}
                </span>
              )}
              {isEmailAvailable.isSuccess && (
                <span
                  data-test="email-available"
                  className="text-sm text-green-500 font-semibold"
                >
                  {t('signup-edit.email.available')}
                </span>
              )}
            </>
          )}
          {errors.email && (
            <span className="text-sm text-red-600 font-semibold">
              {errors.email.type === 'too_small' ? (
                t('signup-edit.email.too-small')
              ) : (
                <span data-test="invalid-email">{t('signup-edit.email.invalid')}</span>
              )}
            </span>
          )}
        </div>
        <div>
          <Label>{t('signup-edit.password.label')}</Label>
          <Input type={'password'} {...register('password')} />
          {errors.password && (
            <span className="text-sm text-red-600 font-semibold">
              {errors.password.type === 'too_small' ? (
                t('signup-edit.password.too-small')
              ) : (
                <>
                  <span>{t('signup-edit.password.valid-conditions.title')}</span>
                  <ul className="list-disc ml-[18px]">
                    <li
                      data-valid={/.{8,}/.test(watch('password'))}
                      data-test="password-length"
                      className="data-[valid=true]:text-green-500"
                    >
                      {t('signup-edit.password.valid-conditions.condition1')}
                    </li>
                    <li
                      data-valid={/(?=(.*[a-z]){1,})(?=(.*[A-Z]){1,})/.test(
                        watch('password'),
                      )}
                      data-test="password-a-z"
                      className="data-[valid=true]:text-green-500"
                    >
                      {t('signup-edit.password.valid-conditions.condition2')}
                    </li>
                    <li
                      data-valid={/(?=(.*[0-9]){1,})/.test(watch('password'))}
                      data-test="password-0-9"
                      className="data-[valid=true]:text-green-500"
                    >
                      {t('signup-edit.password.valid-conditions.condition3')}
                    </li>
                    <li
                      data-valid={/(?=(.*[-!$%^&*()_+|~=`{}\[\]:\/;<>?,.@#]){1,})/.test(
                        watch('password'),
                      )}
                      data-test="password-special-character"
                      className="data-[valid=true]:text-green-500"
                    >
                      {t('signup-edit.password.valid-conditions.condition4', {
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
          <Label>{t('signup-edit.confirm-password.label')}</Label>
          <Input type={'password'} {...register('confirmPassword')} />
          {errors.confirmPassword && (
            <span
              data-test="unmatched-passwords"
              className="text-sm text-red-600 font-semibold"
            >
              {t('signup-edit.confirm-password.unmatched-passwords')}
            </span>
          )}
        </div>
        <span className="text-center block text-sm font-medium text-muted-foreground">
          {t('signup-edit.confirm')}
        </span>
        <div className="flex justify-end mb-2">
          <Button type={'submit'} loading={loading} className="w-full">
            {t('signup-edit.signup')}
          </Button>
        </div>
      </form>
      <div className="flex text-sm justify-center mt-4">
        <span>
          {t('signup-edit.login-redirect.title')}{' '}
          <Link
            data-test="redirect-signup"
            replace
            className="text-primary hover:underline"
            href={'/login'}
          >
            {t('signup-edit.login-redirect.link')}
          </Link>
        </span>
      </div>
    </div>
  );
}
