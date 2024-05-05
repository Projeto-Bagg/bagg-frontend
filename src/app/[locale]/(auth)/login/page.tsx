'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/context/auth-context';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useTranslations } from 'next-intl';
import { Link, useRouter } from '@/common/navigation';

const loginSchema = z.object({
  login: z.string().min(1),
  password: z.string().min(4).max(22),
});

type LoginType = z.infer<typeof loginSchema>;

export default function Page() {
  const auth = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>();
  const { toast } = useToast();
  const t = useTranslations();

  const {
    formState: { errors },
    register,
    handleSubmit,
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
    <div className="p-4 max-w-xl m-auto my-8">
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
              tabIndex={-1}
              href={{ pathname: '/settings/reset-password' }}
              className="text-primary hover:underline text-sm"
            >
              Esqueceu sua senha?
            </Link>
          </div>
          <Input type={'password'} {...register('password')} />
          {errors.password && (
            <span className="text-red-600 text-sm leading-none font-bold">
              {t('login.password.too-small')}
            </span>
          )}
        </div>
        <div>
          <Button disabled={loading} type={'submit'} loading={loading} className="w-full">
            {t('login.submit')}
          </Button>
        </div>
      </form>
      <div className="flex text-sm justify-center mt-4">
        <span>
          {t('login.signup-redirect.title')}{' '}
          <Link
            data-test="redirect-signup"
            replace
            className="text-primary hover:underline"
            href={'/signup'}
          >
            {t('login.signup-redirect.link')}
          </Link>
        </span>
      </div>
    </div>
  );
}
