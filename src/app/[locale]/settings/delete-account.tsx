'use client';

import { PasswordInput } from '@/components/form/password-input';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useDeleteAccount } from '@/hooks/useDeleteAccount';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useTranslations } from 'next-intl';
import React, { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const deleteAccountSchema = z.object({
  currentPassword: z.string().min(1),
});

export type DeleteAccountType = z.infer<typeof deleteAccountSchema>;

export const DeleteAccount = () => {
  const hiddenButtonRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const t = useTranslations();
  const [open, setOpen] = useState<boolean>(false);
  const deleteAccount = useDeleteAccount();
  const {
    register,
    handleSubmit,
    watch,
    trigger,
    formState: { errors },
  } = useForm<DeleteAccountType>({
    defaultValues: {
      currentPassword: '',
    },
    resolver: zodResolver(deleteAccountSchema),
    mode: 'onChange',
  });

  const onSubmit = async (data: DeleteAccountType) => {
    try {
      await deleteAccount.mutateAsync(data.currentPassword);
    } catch (e) {
      if (axios.isAxiosError(e)) {
        if (e.response?.status === 403) {
          return toast({
            title: t('settings.delete-account.toast'),
            variant: 'destructive',
          });
        }
      }
    }
  };

  return (
    <form
      data-test="delete-account-form"
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
        }
      }}
      className="space-y-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div>
        <Label>{t('settings.delete-account.currentPassword')}</Label>
        <PasswordInput
          value={watch('currentPassword')}
          errors={errors.currentPassword}
          data-test="delete-account-current-password"
          {...register('currentPassword')}
        />
      </div>
      <div className="flex justify-end">
        <input type="submit" className="hidden" ref={hiddenButtonRef} />
        <AlertDialog
          open={open}
          onOpenChange={(open) => {
            const currentPassword = watch('currentPassword');
            trigger('currentPassword', { shouldFocus: true });

            if (!currentPassword && open) {
              return;
            }

            setOpen(open);
          }}
        >
          <AlertDialogTrigger asChild>
            <Button
              data-test="delete-account-button"
              type="button"
              variant={'destructive'}
            >
              {t('settings.delete-account.confirm-modal.label')}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t('settings.delete-account.title')}</AlertDialogTitle>
              <AlertDialogDescription>
                {t('settings.delete-account.confirm-modal.description')}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>
                {t('settings.delete-account.confirm-modal.cancel')}
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  hiddenButtonRef.current?.click();
                }}
                data-test="delete-account-action"
                type="submit"
              >
                {t('settings.delete-account.confirm-modal.action')}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </form>
  );
};
