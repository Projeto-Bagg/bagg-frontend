import { ResetPasswordForm } from '@/app/[locale]/settings/reset-password/reset/reset-password-form';
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
  const isUserLogged = hasCookie('bagg.sessionToken', { cookies });

  if (isUserLogged || !token || isTokenExpired(token)) redirect('/');

  return <ResetPasswordForm />;
}
