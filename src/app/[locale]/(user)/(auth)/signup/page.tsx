import React from 'react';
import { Link } from '@/common/navigation';
import SignupForm from '@/app/[locale]/(user)/(auth)/signup/components/form';
import { getTranslations } from 'next-intl/server';

export default async function Page() {
  const t = await getTranslations();

  return (
    <div className="p-4 container max-w-xl m-auto my-8">
      <SignupForm />
      <div className="flex text-sm justify-center mt-4">
        <span>
          {t('signup-edit.login-redirect.title')}{' '}
          <Link
            data-test="redirect-signup"
            replace
            className="text-primary hover:underline"
            href={'/login'}
          >
            {t('signup-edit.login-redirect.link')}
          </Link>
        </span>
      </div>
    </div>
  );
}
