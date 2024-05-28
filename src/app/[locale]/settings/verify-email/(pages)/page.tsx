import { getCookie } from 'cookies-next';
import axios from '@/services/axios';
import { redirect } from '@/common/navigation';
import { cookies } from 'next/headers';
import { VerifyEmail } from '@/app/[locale]/settings/verify-email/(pages)/verify-email';

export default async function Page() {
  try {
    const tempAccessToken = getCookie('bagg.temp-session-token', { cookies });

    if (!tempAccessToken) {
      return redirect('/');
    }

    await axios.get('/users/send-email-confirmation', {
      headers: {
        Authorization: `Bearer ${tempAccessToken}`,
      },
    });

    return <VerifyEmail />;
  } catch (error) {
    redirect('/');
  }
}
