'use client';

import { passwordRegex, usernameRegex } from '@/common/regex';
import { BirthdateDay } from '@/components/form/birthdate-day';
import { BrithdateMonth } from '@/components/form/birthdate-month';
import { BirthdateYear } from '@/components/form/birthdate-year';
import { EmailInput } from '@/components/form/email-input';
import { PasswordInput } from '@/components/form/password-input';
import { UsernameInput } from '@/components/form/username-input';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/auth-context';
import axios from '@/services/axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useDebounce } from 'use-debounce';
import { z } from 'zod';

const signUpSchema = z
  .object({
    fullName: z.string().min(3).max(64),
    username: z.string().min(3).max(20).regex(usernameRegex),
    email: z.string().min(1).email(),
    birthdateDay: z.string().min(1),
    birthdateMonth: z.string().min(1),
    birthdateYear: z.string().min(1),
    password: z.string().min(1).regex(passwordRegex, 'Password too weak'),
    confirmPassword: z.string(),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({ code: 'custom', path: ['confirmPassword'] });
    }
  });

type SignUpType = z.infer<typeof signUpSchema>;

export default function SignupForm() {
  const auth = useAuth();
  const [loading, setLoading] = useState<boolean>();
  const t = useTranslations();
  const {
    control,
    formState: { errors },
    register,
    handleSubmit,
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
      })
      .catch(() => {
        setLoading(false);
      });
  };

  return (
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
        <UsernameInput
          {...register('username')}
          errors={errors.username}
          value={watch('username')}
          isUsernameAvailable={
            isUsernameAvailable.isFetched ? isUsernameAvailable.isSuccess : undefined
          }
        />
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
        <EmailInput
          errors={errors.email}
          isEmailAvailable={
            isEmailAvailable.isFetched ? isEmailAvailable.isSuccess : undefined
          }
          value={watch('email')}
          {...register('email')}
        />
      </div>
      <div>
        <Label>{t('signup-edit.password.label')}</Label>
        <PasswordInput
          errors={errors.password}
          value={watch('password')}
          {...register('password')}
        />
      </div>
      <div>
        <Label>{t('signup-edit.confirm-password.label')}</Label>
        <PasswordInput
          errors={errors.confirmPassword}
          value={watch('confirmPassword')}
          {...register('confirmPassword')}
        />
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
  );
}
