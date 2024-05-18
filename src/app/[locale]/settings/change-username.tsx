'use client';

import { usernameRegex } from '@/common/regex';
import { UsernameInput } from '@/components/form/username-input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/auth-context';
import { useChangeUsername } from '@/hooks/settings';
import axios from '@/services/axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useDebounce } from 'use-debounce';
import { z } from 'zod';

const changeUsernameSchema = z.object({
  username: z.string().min(3).max(20).regex(usernameRegex),
});

export type ChangeUsernameType = z.infer<typeof changeUsernameSchema>;

export const ChangeUsername = () => {
  const t = useTranslations();
  const auth = useAuth();
  const changeUsername = useChangeUsername();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<ChangeUsernameType>({
    defaultValues: {
      username: '',
    },
    resolver: zodResolver(changeUsernameSchema),
    mode: 'onChange',
  });

  const username = watch().username;
  const [debouncedQuery] = useDebounce(username, 1000);
  const isUsernameAvailable = useQuery({
    queryFn: () => axios.get(`users/username-availability/${debouncedQuery}`),
    queryKey: ['username-availability', debouncedQuery],
    enabled: !!debouncedQuery && !errors.username,
  });

  const onSubmit = async (data: ChangeUsernameType) => {
    if (isUsernameAvailable.isError) {
      return;
    }

    await changeUsername.mutateAsync(data.username);
    reset();
  };

  return (
    <form
      data-test="change-username-form"
      className="space-y-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div>
        <Label>{t('signup-edit.username.label')}</Label>
        <UsernameInput
          {...register('username')}
          placeholder={auth.user?.username}
          errors={errors.username}
          isUsernameAvailable={
            isUsernameAvailable.isFetched ? isUsernameAvailable.isSuccess : undefined
          }
        />
      </div>
      <div className="flex flex-col justify-end items-end">
        <Button loading={changeUsername.isPending} type="submit">
          {t('commons.confirm')}
        </Button>
        {changeUsername.data?.status === 200 && (
          <span
            data-test="username-changed-success"
            className="text-sm text-green-500 font-semibold"
          >
            {t('settings.username.success')}
          </span>
        )}
      </div>
    </form>
  );
};
