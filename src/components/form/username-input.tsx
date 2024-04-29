import { Input } from '@/components/ui/input';
import { useTranslations } from 'next-intl';
import React from 'react';
import { FieldError } from 'react-hook-form';

export const UsernameInput = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<typeof Input> & {
    errors?: FieldError;
    isUsernameAvailable?: boolean;
  }
>(({ errors, isUsernameAvailable, ...props }, ref) => {
  const t = useTranslations();

  return (
    <div>
      <Input {...props} ref={ref} />
      {!errors && isUsernameAvailable !== undefined && (
        <>
          {isUsernameAvailable === false && (
            <span
              data-test="username-not-available"
              className="text-sm text-red-600 font-semibold"
            >
              {t('signup-edit.username.not-available')}
            </span>
          )}
          {isUsernameAvailable === true && (
            <span
              data-test="username-available"
              className="text-sm text-green-500 font-semibold"
            >
              {t('signup-edit.username.available')}
            </span>
          )}
        </>
      )}
      {errors && (
        <span className="text-red-600 text-sm font-semibold">
          {errors.type === 'too_small' ? (
            t('signup-edit.username.too-small')
          ) : (
            <>
              {t('signup-edit.username.valid-conditions.title')}
              <ul className="list-disc ml-[18px]">
                <li
                  data-valid={/^.{3,20}$/.test(props.value?.toString() || '')}
                  className="data-[valid=true]:text-green-500"
                >
                  {t('signup-edit.username.valid-conditions.condition1')}
                </li>
                <li
                  data-valid={/^[a-zA-Z0-9_]+$/.test(props.value?.toString() || '')}
                  className="data-[valid=true]:text-green-500"
                >
                  {t('signup-edit.username.valid-conditions.condition2')}
                </li>
              </ul>
            </>
          )}
        </span>
      )}
    </div>
  );
});

UsernameInput.displayName = 'UsernameInput';
