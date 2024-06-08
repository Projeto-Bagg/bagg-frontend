'use client';

import { useRouter } from '@/common/navigation';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/auth-context';
import axios from '@/services/axios';
import { deleteCookie, getCookie, setCookie } from 'cookies-next';
import { Mail } from 'lucide-react';
import { useTranslations } from 'next-intl';
import React, { useState } from 'react';

export const VerifyEmail = () => {
  const t = useTranslations();
  const router = useRouter();
  const auth = useAuth();
  const [loading, setLoading] = useState<boolean>();

  const alreadyConfirmed = async () => {
    const tempAccessToken = getCookie('bagg.temp-access-token');
    const tempRefreshToken = getCookie('bagg.temp-refresh-token');
    const accessToken = getCookie('bagg.access-token');

    if (!tempRefreshToken && !accessToken) {
      return router.replace('/login');
    }

    setLoading(true);

    const isEmailVerified = await axios.get('users/is-email-verified', {
      headers: { Authorization: `Bearer ${tempAccessToken}` },
      validateStatus: () => true,
    });

    if (isEmailVerified.status !== 200) {
      toast({ variant: 'destructive', title: t('settings.verify-email.fail') });
      setLoading(false);
      return;
    }

    if (accessToken) {
      await auth.refetch();
      setLoading(false);
      router.push('/home');
      return;
    }

    const { data } = await axios.post('/auth/refresh', {
      refreshToken: tempRefreshToken,
    });

    setCookie('bagg.access-token', data.accessToken);
    setCookie('bagg.refresh-token', data.refreshToken);

    deleteCookie('bagg.temp-access-token');
    deleteCookie('bagg.temp-refresh-token');

    toast({ variant: 'success', title: t('settings.verify-email.success') });

    await auth.refetch();
    setLoading(false);
    router.push('/home');
  };

  return (
    <div className="p-4 container max-w-xl m-auto my-8">
      <div className="flex flex-col items-center space-y-4 text-center">
        <div className="rounded-full bg-primary p-4">
          <Mail className="w-[40px] h-[40px] text-white" />
        </div>
        <h1 className="font-semibold tracking-tight text-2xl">
          {t('settings.verify-email.title')}
        </h1>
        <div>
          <p className="text-sm text-muted-foreground">
            {t('settings.verify-email.description')}
          </p>
          <p className="text-sm text-muted-foreground">
            {t('settings.verify-email.already-verified.label')}
          </p>
        </div>
        <Button
          data-test="already-verified-button"
          loading={loading}
          onClick={alreadyConfirmed}
          className="w-full"
        >
          {t('settings.verify-email.already-verified.button')}
        </Button>
      </div>
    </div>
  );
};
