import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { useChangePassword } from '@/hooks/useChangePassword';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useTranslations } from 'next-intl';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1),
    newPassword: z
      .string()
      .min(1)
      .regex(
        /^(?=(.*[a-z]){1,})(?=(.*[A-Z]){1,})(?=(.*[0-9]){1,})(?=(.*[-!$%^&*()_+|~=`{}\[\]:\/;<>?,.@#]){1,}).{8,}$/,
        'Password too weak',
      ),
    confirmPassword: z.string().min(1),
  })
  .superRefine((data, ctx) => {
    if (data.newPassword !== data.confirmPassword) {
      ctx.addIssue({ code: 'custom', path: ['confirmPassword'] });
      return;
    }

    if (data.newPassword === data.currentPassword) {
      ctx.addIssue({ code: 'custom', path: ['newPassword'] });
    }
  });

export type ChangePasswordType = z.infer<typeof changePasswordSchema>;

export const ChangePassword = () => {
  const t = useTranslations();
  const changePassword = useChangePassword();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<ChangePasswordType>({
    resolver: zodResolver(changePasswordSchema),
    mode: 'onChange',
  });

  const onSubmit = async (data: ChangePasswordType) => {
    try {
      await changePassword.mutateAsync(data);
      reset();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        error.response?.status === 409 && toast({ title: 'Senha incorreta' });
      }
    }
  };

  return (
    <div className="flex flex-col sm:flex-row rounded-lg overflow-hidden">
      <div className="bg-accent w-full sm:w-[280px] px-6 sm:px-10 py-6 shrink-0">
        <h2 className="font-semibold">{t('settings.change-password.title')}</h2>
      </div>
      <div className="bg-accent/70 p-6 w-full">
        <form
          data-test="change-password-form"
          className="space-y-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div>
            <Label>{t('settings.change-password.currentPassword.label')}</Label>
            <Input
              data-test="change-password-current-password"
              {...register('currentPassword')}
              type="password"
            />
            {errors.currentPassword && (
              <span className="text-sm text-red-600 font-semibold">
                {errors.currentPassword.type === 'too_small' &&
                  t('settings.change-password.currentPassword.too-small')}
              </span>
            )}
          </div>
          <div>
            <Label>{t('settings.change-password.newPassword.label')}</Label>
            <Input {...register('newPassword')} type="password" />
            {errors.newPassword && (
              <span className="text-sm text-red-600 font-semibold">
                {errors.newPassword.type === 'too_small' &&
                  t('signup-edit.password.too-small')}
                {errors.newPassword.type === 'invalid_string' && (
                  <span data-test="weak-password-error">
                    <span>{t('signup-edit.password.valid-conditions.title')}</span>
                    <ul className="list-disc ml-[18px]">
                      <li
                        data-valid={/.{8,}/.test(watch('newPassword'))}
                        className="data-[valid=true]:text-green-500"
                      >
                        {t('signup-edit.password.valid-conditions.condition1')}
                      </li>
                      <li
                        data-valid={/(?=(.*[0-9]){1,})/.test(watch('newPassword'))}
                        className="data-[valid=true]:text-green-500"
                      >
                        {t('signup-edit.password.valid-conditions.condition2')}
                      </li>
                      <li
                        data-valid={/(?=(.*[a-z]){1,})(?=(.*[A-Z]){1,})/.test(
                          watch('newPassword'),
                        )}
                        className="data-[valid=true]:text-green-500"
                      >
                        {t('signup-edit.password.valid-conditions.condition3')}
                      </li>
                      <li
                        data-valid={/(?=(.*[-!$%^&*()_+|~=`{}\[\]:\/;<>?,.@#]){1,})/.test(
                          watch('newPassword'),
                        )}
                        className="data-[valid=true]:text-green-500"
                      >
                        {t('signup-edit.password.valid-conditions.condition4', {
                          characters: '!@#$%&*()-_=+<>:;/|,.^`}{[]',
                        })}
                      </li>
                    </ul>
                  </span>
                )}
              </span>
            )}
          </div>
          <div>
            <Label>{t('settings.change-password.confirm-password.label')}</Label>
            <Input {...register('confirmPassword')} type="password" />
            {errors && (
              <span className="text-sm text-red-600 font-semibold">
                {errors.confirmPassword?.type === 'too_small' &&
                  t('settings.change-password.confirm-password.too-small')}
                <span data-test="unmatched-passwords-error">
                  {errors.confirmPassword?.type === 'custom' &&
                    t('settings.change-password.confirm-password.unmatched-passwords')}
                </span>
                <span data-test="same-password-error">
                  {errors.newPassword?.type === 'custom' &&
                    t('settings.change-password.newPassword.samePassword')}
                </span>
              </span>
            )}
          </div>
          <div className="flex flex-col justify-end items-end">
            <Button loading={changePassword.isPending} className="mb-2" type="submit">
              {t('commons.confirm')}
            </Button>
            {changePassword.data?.status === 200 && (
              <span
                data-test="password-changed-success"
                className="text-sm text-green-500 font-semibold"
              >
                {t('settings.change-password.success')}
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
