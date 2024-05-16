'use client';

import { Link } from '@/common/navigation';
import { PasswordInput } from '@/components/form/password-input';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/auth-context';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const loginSchema = z.object({
  login: z.string().min(1),
  password: z.string().min(4).max(22),
});

type LoginType = z.infer<typeof loginSchema>;

export const LoginForm = () => {
  const auth = useAuth();
  const [loading, setLoading] = useState<boolean>();
  const { toast } = useToast();
  const t = useTranslations();

  const {
    formState: { errors },
    register,
    handleSubmit,
    watch,
  } = useForm<LoginType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      login: '',
      password: '',
    },
  });

  const handleSignIn = async (data: LoginType) => {
    try {
      setLoading(true);
      await auth.login(data);
    } catch (error) {
      setLoading(false);
      toast({ title: t('login.unauthorized'), value: 'login-error' });
    }
  };

  return (
    <form
      id="login-form"
      className="w-full h-full space-y-4"
      onSubmit={handleSubmit(handleSignIn)}
    >
      <div className="flex mb-4 flex-col space-y-1.5 text-center sm:text-left">
        <h1 className="font-semibold tracking-tight text-2xl">{t('login.title')}</h1>
        <p className="text-sm text-muted-foreground">{t('login.description')}</p>
      </div>
      <div>
        <Label htmlFor="login">{t('login.login.label')}</Label>
        <Input {...register('login')} />
        {errors.login && (
          <span className="text-red-600 text-sm leading-none font-bold">
            {t('login.login.too-small')}
          </span>
        )}
      </div>
      <div>
        <div className="flex justify-between">
          <Label htmlFor="password">{t('login.password.label')}</Label>
          <Link
            data-test="forgot-password"
            tabIndex={-1}
            href={{ pathname: '/settings/reset-password' }}
            className="text-primary hover:underline text-sm"
          >
            {t('login.forgot-password')}
          </Link>
        </div>
        <PasswordInput
          errors={errors.password}
          value={watch('password')}
          {...register('password')}
        />
      </div>
      <div>
        <Button disabled={loading} type={'submit'} loading={loading} className="w-full">
          {t('login.submit')}
        </Button>
      </div>
    </form>
  );
};
