'use client';

import { useAuth } from '@/context/auth-context';
import { useTranslations } from 'next-intl';
import React from 'react';

export const LogoutButton = () => {
  const t = useTranslations();
  const auth = useAuth();

  return (
    <button onClick={() => auth.logout()} className="font-bold">
      {t('header.menu.signout')}
    </button>
  );
};
