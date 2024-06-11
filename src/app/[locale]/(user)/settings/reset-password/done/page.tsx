'use client';

import { useTranslations } from 'next-intl';
import React from 'react';

export default function Page() {
  const t = useTranslations();

  return (
    <div className="p-4 max-w-xl m-auto my-8">
      <div className="flex mb-4 flex-col space-y-1.5 text-center sm:text-left">
        <h1 className="font-semibold tracking-tight text-2xl">
          {t('settings.reset-password.done.title')}
        </h1>
        <p className="text-sm text-muted-foreground">
          {t('settings.reset-password.done.text')}
        </p>
      </div>
    </div>
  );
}
