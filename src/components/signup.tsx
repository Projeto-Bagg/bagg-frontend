import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { useAuth } from '@/context/auth-context';
import { toast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { useTranslations } from 'next-intl';

const signUpSchema = z
  .object({
    displayName: z.string().min(3).max(64),
    username: z.string().min(3).max(15),
    email: z.string().email(),
    birthdate: z.date(),
    password: z.string().min(4).max(22),
    confirmPassword: z.string(),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({ code: 'custom', path: ['confirmPassword'] });
    }
  });

type SignUpType = z.infer<typeof signUpSchema>;

export const Signup = () => {
  const [loading, setLoading] = useState<boolean>();
  const auth = useAuth();
  const t = useTranslations('signup');

  const signUp = useForm<SignUpType>({
    resolver: zodResolver(signUpSchema),
  });

  const handleSignUp = async (data: SignUpType) => {
    try {
      setLoading(true);

      const { confirmPassword, ...signUpData } = data;

      await auth.signUp({
        ...signUpData,
        displayName: data.displayName
          .toLowerCase()
          .replace(/\b\w/g, (c) => c.toUpperCase()),
      });

      await new Promise((resolve) => setTimeout(resolve, 700));

      await auth.login({ email: data.email, password: data.password });
    } catch (error: any) {
      error.response.status === 409 && toast({ title: 'Email já cadastrado' });
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={'ghost'} className="flex gap-2 items-center h-9 cursor-pointer">
          <span className="font-bold uppercase">{t('button')}</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-2xl">{t('title')}</DialogTitle>
          <DialogDescription>{t('description')}</DialogDescription>
        </DialogHeader>
        <form onSubmit={signUp.handleSubmit(handleSignUp)}>
          <div className="mb-4">
            <div className="justify-between flex mb-2">
              <Label>{t('name')}</Label>
              {signUp.formState.errors.displayName && (
                <span className="text-bold text-red-600">{t('name_error')}</span>
              )}
            </div>
            <Input {...signUp.register('displayName')} />
          </div>
          <div className="mb-4">
            <div className="justify-between flex mb-2">
              <Label>{t('username')}</Label>
              {signUp.formState.errors.username && (
                <span className="text-bold text-red-600">{t('username_error')}</span>
              )}
            </div>
            <Input {...signUp.register('username')} />
          </div>
          <div className="mb-4">
            <div className="flex justify-between mb-2">
              <Label>{t('birthdate')}</Label>
              {signUp.formState.errors.birthdate && (
                <span className="text-bold text-red-600">{t('birthdate_error')}</span>
              )}
            </div>
            <Controller
              name="birthdate"
              control={signUp.control}
              render={({ field }) => (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={'outline_no_hover'}
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !signUp.watch('birthdate') && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {signUp.watch('birthdate') ? (
                        format(signUp.watch('birthdate'), 'PPP')
                      ) : (
                        <span>{t('birthdate_placeholder')}</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      pagedNavigation
                      captionLayout="dropdown-buttons"
                      mode="single"
                      selected={signUp.getValues?.('birthdate')}
                      onSelect={field.onChange}
                      initialFocus
                      toDate={new Date()}
                    />
                  </PopoverContent>
                </Popover>
              )}
            />
          </div>
          <div className="mb-4">
            <div className="flex justify-between mb-4">
              <Label>{t('email')}</Label>
              {signUp.formState.errors.email && (
                <span className="text-bold text-red-600">{t('email_error')}</span>
              )}
            </div>
            <Input {...signUp.register('email')} />
          </div>
          <div className="mb-4">
            <div className="flex justify-between mb-2">
              <Label>{t('password')}</Label>
              {signUp.formState.errors.password && (
                <span className="text-bold text-red-600">{t('password_error')}</span>
              )}
            </div>
            <Input type={'password'} {...signUp.register('password')} />
          </div>
          <div className="mb-4">
            <div className="flex justify-between mb-2">
              <Label>{t('confirm_password')}</Label>
              {signUp.formState.errors.confirmPassword && (
                <span className="text-bold text-red-600">
                  {t('confirm_password_error')}
                </span>
              )}
            </div>
            <Input type={'password'} {...signUp.register('confirmPassword')} />
          </div>
          <span className="text-center block mb-4 text-sm font-medium">
            {t('confirm')}
          </span>
          <div className="flex justify-end mb-2">
            <Button type={'submit'} className="w-full">
              {t('signup')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
