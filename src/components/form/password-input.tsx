'use client';

import { Input } from '@/components/ui/input';
import { Eye, EyeOff } from 'lucide-react';
import { useTranslations } from 'next-intl';
import React, { useState } from 'react';
import { FieldError } from 'react-hook-form';

export const PasswordInput = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<typeof Input> & {
    isCreatingPassword?: boolean;
    errors: FieldError | undefined;
  }
>(({ errors, isCreatingPassword, ...props }, ref) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const t = useTranslations();

  return (
    <div>
      <div className="relative">
        <Input type={isPasswordVisible ? 'text' : 'password'} {...props} ref={ref} />
        <button
          type="button"
          onClick={() => {
            setIsPasswordVisible((curr) => !curr);
          }}
          className="absolute text-muted-foreground top-2.5 right-4 "
        >
          {isPasswordVisible ? (
            <EyeOff className="w-5 h-5" />
          ) : (
            <Eye className="w-5 h-5" />
          )}
        </button>
      </div>
      {errors && (
        <span className="text-sm text-red-600 font-semibold">
          {errors.type === 'too_small'
            ? t('signup-edit.password.too-small')
            : isCreatingPassword && (
                <>
                  <span>{t('signup-edit.password.valid-conditions.title')}</span>
                  <ul className="list-disc ml-[18px]">
                    <li
                      data-valid={/.{8,}/.test(props.value?.toString() || '')}
                      data-test="password-length"
                      className="data-[valid=true]:text-green-500"
                    >
                      {t('signup-edit.password.valid-conditions.condition1')}
                    </li>
                    <li
                      data-valid={/(?=(.*[a-z]){1,})(?=(.*[A-Z]){1,})/.test(
                        props.value?.toString() || '',
                      )}
                      data-test="password-a-z"
                      className="data-[valid=true]:text-green-500"
                    >
                      {t('signup-edit.password.valid-conditions.condition2')}
                    </li>
                    <li
                      data-valid={/(?=(.*[0-9]){1,})/.test(props.value?.toString() || '')}
                      data-test="password-0-9"
                      className="data-[valid=true]:text-green-500"
                    >
                      {t('signup-edit.password.valid-conditions.condition3')}
                    </li>
                    <li
                      data-valid={/(?=(.*[-!$%^&*()_+|~=`{}\[\]:\/;<>?,.@#]){1,})/.test(
                        props.value?.toString() || '',
                      )}
                      data-test="password-special-character"
                      className="data-[valid=true]:text-green-500"
                    >
                      {t('signup-edit.password.valid-conditions.condition4', {
                        characters: '!@#$%&*()-_=+<>:;/|,.^`}{[]',
                      })}
                    </li>
                  </ul>
                </>
              )}
        </span>
      )}
    </div>
  );
});

PasswordInput.displayName = 'PasswordInput';
