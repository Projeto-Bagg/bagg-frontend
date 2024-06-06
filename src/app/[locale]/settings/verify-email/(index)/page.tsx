import { getCookie } from 'cookies-next';
import axios from '@/services/axios';
import { redirect } from '@/common/navigation';
import { cookies } from 'next/headers';
import { VerifyEmail } from '@/app/[locale]/settings/verify-email/(index)/components/verify-email';

export default async function Page() {
  const tempAccessToken = getCookie('bagg.temp-session-token', { cookies });

  if (!tempAccessToken) {
    return redirect('/');
  }

  await axios
    .get('/users/send-email-confirmation', {
      headers: {
        Authorization: `Bearer ${tempAccessToken}`,
      },
    })
    .catch(() => {
      if (process.env.IS_TEST !== 'true') {
        redirect('/');
      }
    });

  return <VerifyEmail />;
}
