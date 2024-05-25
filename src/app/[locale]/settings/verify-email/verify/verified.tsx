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

        const temp-refresh-token = getCookie('bagg.temp-refresh-token');

        if (!temp-refresh-token) {
          return router.replace('/login');
        }

        const { data } = await axios.post('/auth/refresh', {
          refreshToken: temp-refresh-token,
        });

        setCookie('bagg.access-token', data.accessToken);
        setCookie('bagg.refresh-token', data.refreshToken);

        deleteCookie('bagg.temp-session-token');
        deleteCookie('bagg.temp-refresh-token');

        await auth.refetch();
        router.replace('/home');
      } catch (error) {
        router.replace('/login');
      } finally {
        setConfirmed(true);
        toast({ variant: 'success', title: t('settings.verify-email.success') });
      }
    };
    refreshToken();
  }, [auth, router, t, confirmed]);

  return <></>;
};
