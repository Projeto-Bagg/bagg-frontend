'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/common/navigation';
import axios from '@/services/axios';
import { useSearchParams } from 'next/navigation';
import { passwordRegex } from '@/common/regex';
import { PasswordInput } from '@/components/form/password-input';

const forgotPasswordSchema = z
  .object({
    password: z.string().min(1).regex(passwordRegex, 'Password too weak'),
    confirmPassword: z.string(),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({ code: 'custom', path: ['confirmPassword'] });
    }
  });

type ForgotPasswordType = z.infer<typeof forgotPasswordSchema>;

export const ResetPasswordForm = () => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>();
  const t = useTranslations();
  const searchParams = useSearchParams();

  const {
    formState: { errors },
    register,
    watch,
    handleSubmit,
  } = useForm<ForgotPasswordType>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: 'onChange',
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const handleForgotPassword = async (data: ForgotPasswordType) => {
    const token = searchParams.get('token');

    try {
      setLoading(true);
      await axios.post('/users/reset-password/' + token, {
        password: data.password,
      });
      router.replace('/login');
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-xl m-auto my-8">
      <form
        id="forgot-password-form"
        className="w-full h-full space-y-4"
        onSubmit={handleSubmit(handleForgotPassword)}
      >
        <div className="mb-4 text-center sm:text-left">
          <h1 className="font-semibold tracking-tight text-2xl">
            {t('settings.reset-password.reset.title')}
          </h1>
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
        <Button disabled={loading} type={'submit'} loading={loading} className="w-full">
          {t('settings.reset-password.submit')}
        </Button>
      </form>
    </div>
  );
};
