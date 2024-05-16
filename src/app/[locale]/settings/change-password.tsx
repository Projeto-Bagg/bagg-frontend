'use client';

import { passwordRegex } from '@/common/regex';
import { PasswordInput } from '@/components/form/password-input';
import { Button } from '@/components/ui/button';
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
    newPassword: z.string().min(1).regex(passwordRegex, 'Password too weak'),
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
        error.response?.status === 409 &&
          toast({ title: 'Senha incorreta', variant: 'destructive' });
      }
    }
  };

  return (
    <form
      data-test="change-password-form"
      className="space-y-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div>
        <Label>{t('settings.change-password.currentPassword.label')}</Label>
        <PasswordInput
          errors={errors.currentPassword}
          value={watch('currentPassword')}
          data-test="change-password-current-password"
          {...register('currentPassword')}
        />
      </div>
      <div>
        <Label>{t('settings.change-password.newPassword.label')}</Label>
        <PasswordInput
          value={watch('newPassword')}
          errors={errors.newPassword}
          {...register('newPassword')}
        />
      </div>
      <div>
        <Label>{t('settings.change-password.confirm-password.label')}</Label>
        <PasswordInput
          value={watch('confirmPassword')}
          errors={errors.confirmPassword}
          {...register('confirmPassword')}
        />
        {errors && (
          <span className="text-sm text-red-600 font-semibold">
            <div>
              <span data-test="unmatched-passwords-error">
                {errors.confirmPassword?.type === 'custom' &&
                  t('settings.change-password.confirm-password.unmatched-passwords')}
              </span>
            </div>
            <div>
              <span data-test="same-password-error">
                {errors.newPassword?.type === 'custom' &&
                  t('settings.change-password.newPassword.samePassword')}
              </span>
            </div>
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
  );
};
