import { getCookie } from 'cookies-next';
import { cookies } from 'next/headers';
import { decodeJwt } from 'jose';
import { redirect } from '@/common/navigation';
import { Admin } from '@/app/[locale]/admin/admin';

export default async function Page() {
  const jwt = getCookie('bagg.sessionToken', { cookies });

  if (!jwt) {
    return redirect('/');
  }

  const currentUser = decodeJwt<UserFromJwt>(jwt);

  if (currentUser.role !== 'ADMIN') {
    return redirect('/');
  }

  return <Admin />;
}
