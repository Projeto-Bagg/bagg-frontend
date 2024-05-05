'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';
import { getCookie } from 'cookies-next';
import axios from '@/services/axios';
import { useRouter } from '@/common/navigation';

export default function Page() {
  const [loading, setLoading] = useState<boolean>();
  const t = useTranslations();
  const router = useRouter();

  const onSubmit = async () => {
    setLoading(true);

    const tempJwt = getCookie('bagg.tempSessionToken');

    await axios.get('/users/send-email-confirmation', {
      headers: {
        Authorization: `Bearer ${tempJwt}`,
      },
    });

    router.push('/settings/verify-email/done');
  };

  return (
    <>
      <h1 className="font-semibold tracking-tight text-2xl">
        {t('settings.verify-email.title')}
      </h1>
      <p className="text-sm text-muted-foreground">
        {t('settings.verify-email.description')}
      </p>
      <Button
        onClick={onSubmit}
        disabled={loading}
        type={'submit'}
        loading={loading}
        className="w-full"
      >
        {t('settings.verify-email.submit')}
      </Button>
    </>
  );
}
