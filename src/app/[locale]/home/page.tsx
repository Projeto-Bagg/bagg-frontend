import { getCookie } from 'cookies-next';
import React from 'react';
import { cookies } from 'next/headers';
import { redirect } from '@/common/navigation';
import Home from '@/app/[locale]/home/home';

export default function Page() {
  const accessToken = getCookie('bagg.sessionToken', { cookies });

  if (!accessToken) {
    return redirect('/');
  }

  return <Home />;
}
