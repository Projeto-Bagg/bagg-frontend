import Image from 'next/image';
import React from 'react';
import Ranking from '@/assets/ranking.png';
import { Link, redirect } from '@/common/navigation';
import { getTranslations } from 'next-intl/server';
import { getCookie } from 'cookies-next';
import { cookies } from 'next/headers';

export default async function Page() {
  const accessToken = getCookie('bagg.sessionToken', { cookies });

  if (accessToken) {
    return redirect('/home');
  }

  const t = await getTranslations();

  return (
    <div className="flex flex-col lg:flex-row justify-center text-sm lg:text-base">
      <div className="p-8">
        <div className="mb-4">
          <h2 className="font-semibold text-2xl">Bagg</h2>
          <span className="text-muted-foreground">{t('index.description')}</span>
        </div>
        <div className="flex flex-col lg:w-[512px]">
          <h2 className="font-bold">{t('index.why-join-us.title')}</h2>
          <ul className="list-disc mb-4 space-y-2">
            <li>
              <span className="font-bold">{t('index.why-join-us.reason1.title')} </span>
              {t('index.why-join-us.reason1.description')}
            </li>
            <li>
              <span className="font-bold">{t('index.why-join-us.reason2.title')} </span>
              {t('index.why-join-us.reason2.description')}
            </li>
            <li>
              <span className="font-bold">{t('index.why-join-us.reason3.title')} </span>
              {t('index.why-join-us.reason3.description')}
            </li>
          </ul>
          <div className="w-full space-y-2">
            <h2 className="font-semibold text-xl">{t('index.got-interested')}</h2>
            <Link
              href={'/signup'}
              className="px-2 py-3 border flex justify-center text-sm font-semibold items-center w-full transition-colors bg-primary hover:bg-primary/90 rounded-2xl"
            >
              {t('index.create-account')}
            </Link>
            <span className="flex justify-center">{t('index.or')}</span>
            <Link
              href={'/login'}
              className="px-2 py-3 border flex text-primary justify-center text-sm font-semibold items-center w-full border-input rounded-2xl"
            >
              {t('index.login')}
            </Link>
          </div>
        </div>
      </div>
      <div className="p-8">
        <div className="flex justify-center lg:max-w-[512px]">
          <Image src={Ranking} alt="" />
        </div>
      </div>
    </div>
  );
}
