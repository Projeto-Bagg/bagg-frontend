import { Verified } from '@/app/[locale]/(user)/settings/verify-email/verify/components/verified';
import { redirect } from '@/common/navigation';
import axios from '@/services/axios';
import { isTokenExpired } from '@/utils/is-token-expired';
import { hasCookie } from 'cookies-next';
import { cookies } from 'next/headers';

interface PageProps {
  searchParams: {
    token: string;
  };
}

export default async function Page({ searchParams: { token } }: PageProps) {
  const isUserLogged = hasCookie('bagg.access-token', { cookies });

  if (isUserLogged || !token || isTokenExpired(token)) redirect('/');

  try {
    await axios.get('/users/verify-email-confirmation/' + token);
  } catch (error) {
    redirect('/');
  }

  return <Verified />;
}
