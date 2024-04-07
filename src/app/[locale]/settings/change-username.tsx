import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/auth-context';
import { useChangeUsername } from '@/hooks/useChangeUsername';
import axios from '@/services/axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useDebounce } from 'use-debounce';
import { z } from 'zod';

const changeUsernameSchema = z.object({
  username: z
    .string()
    .min(3)
    .max(20)
    .regex(/^[a-zA-Z0-9_]+$/),
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

    const response = await changeUsername.mutateAsync(data.username);
    reset();
    response.status === 200 && toast({ title: t('settings.username.toast') });
  };

  return (
    <div className="flex flex-col sm:flex-row rounded-lg overflow-hidden">
      <div className="bg-accent w-full sm:w-[280px] px-6 sm:px-10 py-6 shrink-0">
        <h2 className="font-semibold">{t('settings.username.title')}</h2>
      </div>
      <div className="bg-accent/70 p-6 w-full">
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <Label>{t('signup-edit.username.label')}</Label>
            <Input placeholder={auth.user?.username} {...register('username')} />
            {errors.username && (
              <span className="text-red-600 text-sm font-semibold">
                {errors.username.type === 'too_small' ? (
                  t('signup-edit.username.too-small')
                ) : (
                  <>
                    {t('signup-edit.username.valid-conditions.title')}
                    <ul className="list-disc ml-[18px]">
                      <li
                        data-valid={/^.{3,20}$/.test(watch('username'))}
                        className="data-[valid=true]:text-green-500"
                      >
                        {t('signup-edit.username.valid-conditions.condition1')}
                      </li>
                      <li
                        data-valid={/^[a-zA-Z0-9_]+$/.test(watch('username'))}
                        className="data-[valid=true]:text-green-500"
                      >
                        {t('signup-edit.username.valid-conditions.condition2')}
                      </li>
                    </ul>
                  </>
                )}
              </span>
            )}
            {!errors.username && (
              <>
                {isUsernameAvailable.isError && (
                  <span className="text-sm text-red-600 font-semibold">
                    {t('signup-edit.username.not-available')}
                  </span>
                )}
                {isUsernameAvailable.isSuccess && (
                  <span className="text-sm text-green-600 font-semibold">
                    {t('signup-edit.username.available')}
                  </span>
                )}
              </>
            )}
          </div>
          <div className="flex justify-end">
            <Button loading={changeUsername.isPending} type="submit">
              {t('commons.confirm')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};