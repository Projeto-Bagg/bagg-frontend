'use client';

import { useRouter } from '@/common/navigation';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/auth-context';
import axios from '@/services/axios';
import { deleteCookie, getCookie, setCookie } from 'cookies-next';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

export const Verified = () => {
  const auth = useAuth();
  const router = useRouter();
  const t = useTranslations();
  const [confirmed, setConfirmed] = useState<boolean>(false);

  useEffect(() => {
    const refreshToken = async () => {
      try {
        if (confirmed) return;

        toast({ variant: 'success', title: t('settings.verify-email.success') });

        const tempRefreshToken = getCookie('bagg.temp-refresh-token');

        if (!tempRefreshToken) {
          return router.replace('/login');
        }

        const { data } = await axios.post('/auth/refresh', {
          refreshToken: tempRefreshToken,
        });

        setCookie('bagg.access-token', data.accessToken);
        setCookie('bagg.refresh-token', data.refreshToken);

        deleteCookie('bagg.temp-access-token');
        deleteCookie('bagg.temp-refresh-token');

        await auth.refetch();
        router.replace('/home');
      } catch (error) {
        router.replace('/login');
      } finally {
        setConfirmed(true);
      }
    };
    refreshToken();
  }, [auth, router, t, confirmed]);

  return <></>;
};
