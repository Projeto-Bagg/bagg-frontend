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
    const tempAccessToken = getCookie('bagg.tempSessionToken');
    const tempRefreshToken = getCookie('bagg.tempRefreshToken');

    if (!tempRefreshToken) {
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

    const { data } = await axios.post('/auth/refresh', {
      refreshToken: tempRefreshToken,
    });

    setCookie('bagg.sessionToken', data.accessToken);
    setCookie('bagg.refreshToken', data.refreshToken);

    deleteCookie('bagg.tempSessionToken');
    deleteCookie('bagg.tempRefreshToken');

    toast({ variant: 'success', title: t('settings.verify-email.success') });

    await auth.refetch();

    setLoading(false);

    router.push('/');
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
