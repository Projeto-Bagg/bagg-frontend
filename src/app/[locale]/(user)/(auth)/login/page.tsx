import React from 'react';
import { Link } from '@/common/navigation';
import { LoginForm } from '@/app/[locale]/(user)/(auth)/login/components/form';
import { getTranslations } from 'next-intl/server';

export default async function Page() {
  const t = await getTranslations();

  return (
    <div className="p-4 container max-w-xl m-auto my-8">
      <LoginForm />
      <div className="flex text-sm justify-center mt-4">
        <span>
          {t('login.signup-redirect.title')}{' '}
          <Link
            data-test="redirect-signup"
            replace
            className="text-primary hover:underline"
            href={'/signup'}
          >
            {t('login.signup-redirect.link')}
          </Link>
        </span>
      </div>
    </div>
  );
}
