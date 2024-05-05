'use client';

import { Input } from '@/components/ui/input';
import { useTranslations } from 'next-intl';
import React from 'react';
import { FieldError } from 'react-hook-form';

export const EmailInput = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<typeof Input> & { errors?: FieldError; isEmailAvailable?: boolean }
>(({ errors, isEmailAvailable, ...props }, ref) => {
  const t = useTranslations();

  return (
    <div>
      <Input {...props} ref={ref} />
      {!errors && isEmailAvailable !== undefined && (
        <>
          {isEmailAvailable === false && (
            <span
              data-test="email-not-available"
              className="text-sm text-red-600 font-semibold"
            >
              {t('signup-edit.email.not-available')}
            </span>
          )}
          {isEmailAvailable === true && (
            <span
              data-test="email-available"
              className="text-sm text-green-500 font-semibold"
            >
              {t('signup-edit.email.available')}
            </span>
          )}
        </>
      )}
      {errors && (
        <span className="text-sm text-red-600 font-semibold">
          {errors.type === 'too_small' ? (
            t('signup-edit.email.too-small')
          ) : (
            <span data-test="invalid-email">{t('signup-edit.email.invalid')}</span>
          )}
        </span>
      )}
    </div>
  );
});

EmailInput.displayName = 'EmailInput';
