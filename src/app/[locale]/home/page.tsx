import { getCookie } from 'cookies-next';
import React from 'react';
import { cookies } from 'next/headers';
import { redirect } from '@/common/navigation';
import Home from '@/app/[locale]/home/home';

export default function Page() {
  const accessToken = getCookie('bagg.access-token', { cookies });

  if (!accessToken) {
    return redirect('/');
  }

  const defaultFeed = getCookie('bagg.default-feed', { cookies }) as
    | 'for-you'
    | 'following'
    | undefined;

  return <Home defaultFeed={defaultFeed} />;
}
