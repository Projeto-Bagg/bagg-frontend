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

const forgotPasswordSchema = z.object({
  email: z.string().min(1).email(),
});

type ForgotPasswordType = z.infer<typeof forgotPasswordSchema>;

export default function Page() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>();
  const t = useTranslations();

  const {
    formState: { errors },
    register,
    handleSubmit,
  } = useForm<ForgotPasswordType>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const handleForgotPassword = async (data: ForgotPasswordType) => {
    try {
      setLoading(true);
      await axios.get('/users/send-reset-password/' + data.email);
      router.push('/settings/reset-password/done');
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
        <div className="flex mb-4 flex-col space-y-1.5 text-center sm:text-left">
          <h1 className="font-semibold tracking-tight text-2xl">
            {t('settings.reset-password.title')}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t('settings.reset-password.description')}
          </p>
        </div>
        <div>
          <Label htmlFor="login">{t('signup-edit.email.label')}</Label>
          <Input {...register('email')} />
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
        <Button disabled={loading} type={'submit'} loading={loading} className="w-full">
          {t('settings.reset-password.submit')}
        </Button>
      </form>
    </div>
  );
}
