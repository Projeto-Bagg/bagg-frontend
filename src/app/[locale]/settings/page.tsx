import React from 'react';
import { DeleteAccount } from '@/app/[locale]/settings/delete-account';
import { ChangePassword } from '@/app/[locale]/settings/change-password';
import { ChangeUsername } from '@/app/[locale]/settings/change-username';
import { getTranslations } from 'next-intl/server';

export default async function Page() {
  const t = await getTranslations();

  return (
    <div className="p-4 container">
      <div className="mb-4">
        <h2 className="font-bold w-fit text-xl sm:text-2xl border-b-2 border-primary pb-1">
          {t('settings.title')}
        </h2>
      </div>
      <div className="space-y-2">
        <div className="flex border flex-col sm:flex-row rounded-lg overflow-hidden">
          <div className="bg-muted w-full sm:w-[280px] px-4 sm:px-10 py-6 shrink-0">
            <h2 className="font-semibold">{t('settings.username.title')}</h2>
          </div>
          <div className="bg-muted/40 dark:bg-muted/70 p-4 sm:p- w-full">
            <ChangeUsername />
          </div>
        </div>
        <div className="flex border flex-col sm:flex-row rounded-lg overflow-hidden">
          <div className="bg-muted w-full sm:w-[280px] px-4 sm:px-10 py-6 shrink-0">
            <h2 className="font-semibold">{t('settings.change-password.title')}</h2>
          </div>
          <div className="bg-muted/40 dark:bg-muted/70 p-4 sm:p-6 w-full">
            <ChangePassword />
          </div>
        </div>
        <div className="flex border flex-col sm:flex-row rounded-lg overflow-hidden">
          <div className="bg-muted w-full sm:w-[280px] px-4 sm:px-10 py-6 shrink-0">
            <h2 className="font-semibold text-red-600">
              {t('settings.delete-account.title')}
            </h2>
          </div>
          <div className="bg-muted/40 dark:bg-muted/70 p-4 sm:p- w-full">
            <DeleteAccount />
          </div>
        </div>
      </div>
    </div>
  );
}
