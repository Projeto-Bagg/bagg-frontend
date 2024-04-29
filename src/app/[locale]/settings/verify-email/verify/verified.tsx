'use client';

import { redirect, useRouter } from '@/common/navigation';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/auth-context';
import axios from '@/services/axios';
import { deleteCookie, getCookie, setCookie } from 'cookies-next';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';

export const Verified = () => {
  const auth = useAuth();
  const router = useRouter();
  const t = useTranslations();

  useEffect(() => {
    const refreshToken = async () => {
      const tempRefreshToken = getCookie('bagg.tempRefreshToken');

      if (!tempRefreshToken) {
        return router.replace('/login');
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
    };
    refreshToken();
  }, [auth, router, t]);

  return redirect('/');
};
