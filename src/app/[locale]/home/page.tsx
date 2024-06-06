import { getCookie } from 'cookies-next';
import React from 'react';
import { cookies } from 'next/headers';
import { redirect } from '@/common/navigation';
import { getTranslations } from 'next-intl/server';
import { HomepageFeed } from '@/app/[locale]/home/components/homepage-feed';

export default async function Page() {
  const accessToken = getCookie('bagg.access-token', { cookies });

  if (!accessToken) {
    return redirect('/');
  }

  const t = await getTranslations();

  return (
    <div data-test="homepage-feed" className="p-4 container">
      <div className="mb-2">
        <h2 className="font-bold w-fit text-xl sm:text-2xl border-b-2 border-primary pb-1">
          {t('homepage.title')}
        </h2>
      </div>
      <HomepageFeed />
    </div>
  );
}
