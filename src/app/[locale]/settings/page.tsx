'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { DeleteAccount } from '@/app/[locale]/settings/delete-account';
import { ChangePassword } from '@/app/[locale]/settings/change-password';
import { ChangeUsername } from '@/app/[locale]/settings/change-username';

export default function Page() {
  const t = useTranslations();

  return (
    <div className="p-4">
      <div className="mb-4">
        <h2 className="font-bold w-fit text-xl sm:text-2xl border-b-2 border-primary pb-1">
          {t('settings.title')}
        </h2>
      </div>
      <div className="space-y-2">
        <ChangeUsername />
        <ChangePassword />
        <DeleteAccount />
      </div>
    </div>
  );
}
