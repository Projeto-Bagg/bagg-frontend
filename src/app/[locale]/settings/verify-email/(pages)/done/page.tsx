'use client';

import { useRouter } from '@/common/navigation';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/auth-context';
import axios from '@/services/axios';
import { deleteCookie, getCookie, setCookie } from 'cookies-next';
import { useTranslations } from 'next-intl';
import React, { useState } from 'react';

export default function Page() {
  const t = useTranslations();
  const router = useRouter();
  const auth = useAuth();
  const [loading, setLoading] = useState<boolean>();

  const alreadyConfirmed = async () => {
    const tempAccessToken = getCookie('bagg.temp-session-token');
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

    deleteCookie('bagg.temp-session-token');
    deleteCookie('bagg.temp-refresh-token');

    toast({ variant: 'success', title: t('settings.verify-email.success') });

    await auth.refetch();
    setLoading(false);
    router.push('/home');
  };

  return (
    <>
      <h1 className="font-semibold tracking-tight text-2xl">
        {t('settings.verify-email.done.done')}
      </h1>
      <div>
        <p className="text-sm text-muted-foreground">
          {t('settings.verify-email.done.description')}
        </p>
        <p className="text-sm text-muted-foreground">
          {t('settings.verify-email.done.already-verified.label')}
        </p>
      </div>
      <Button loading={loading} onClick={alreadyConfirmed} className="w-full">
        {t('settings.verify-email.done.already-verified.button')}
      </Button>
    </>
  );
}
