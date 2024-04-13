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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useDeleteAccount } from '@/hooks/useDeleteAccount';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useTranslations } from 'next-intl';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const deleteAccountSchema = z.object({
  currentPassword: z.string(),
});

export type DeleteAccountType = z.infer<typeof deleteAccountSchema>;

export const DeleteAccount = () => {
  const { toast } = useToast();
  const t = useTranslations();
  const [open, setOpen] = useState<boolean>(false);
  const deleteAccount = useDeleteAccount();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<DeleteAccountType>({
    resolver: zodResolver(deleteAccountSchema),
  });

  const onSubmit = async (data: DeleteAccountType) => {
    try {
      await deleteAccount.mutateAsync(data.currentPassword);
    } catch (e) {
      if (axios.isAxiosError(e)) {
        if (e.response?.status === 403) {
          return toast({ title: t('settings.delete-account.toast') });
        }
      }
    }
  };

  return (
    <div className="flex flex-col sm:flex-row rounded-lg overflow-hidden">
      <div className="bg-accent w-full sm:w-[280px] px-6 sm:px-10 py-6 shrink-0">
        <h2 className="font-semibold text-red-600">
          {t('settings.delete-account.title')}
        </h2>
      </div>
      <div className="bg-accent/70 p-6 w-full">
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
            <Input
              data-test="delete-account-current-password"
              {...register('currentPassword')}
              type="password"
            />
            {errors.currentPassword && (
              <span className="text-sm text-red-600 font-semibold">
                {t('signup-edit.password.too-small')}
              </span>
            )}
          </div>
          <div className="flex justify-end">
            <AlertDialog
              open={open}
              onOpenChange={(open) => {
                const currentPassword = watch('currentPassword');

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
                  <AlertDialogTitle>
                    {t('settings.delete-account.title')}
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    {t('settings.delete-account.confirm-modal.description')}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>
                    {t('settings.delete-account.confirm-modal.cancel')}
                  </AlertDialogCancel>
                  <AlertDialogAction data-test="delete-account-action" type="submit">
                    {t('settings.delete-account.confirm-modal.action')}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </form>
      </div>
    </div>
  );
};
