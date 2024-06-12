import { ResetPasswordForm } from '@/app/[locale]/(user)/settings/reset-password/reset/components/reset-password-form';
import { redirect } from '@/common/navigation';
import { isTokenExpired } from '@/utils/is-token-expired';
import { hasCookie } from 'cookies-next';
import { cookies } from 'next/headers';
import React from 'react';

interface PageProps {
  searchParams: {
    token: string;
  };
}

export default function Page({ searchParams: { token } }: PageProps) {
  const isUserLogged = hasCookie('bagg.access-token', { cookies });

  if (isUserLogged || !token || isTokenExpired(token)) redirect('/');

  return <ResetPasswordForm />;
}
