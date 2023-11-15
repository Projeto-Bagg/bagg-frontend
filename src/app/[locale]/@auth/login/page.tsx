'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/context/auth-context';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useTranslations } from 'next-intl';
import { useOriginTracker } from '@/context/origin-tracker';
import { useRouter } from '@/common/navigation';

const loginSchema = z.object({
  login: z.string(),
  password: z.string().min(4).max(22),
});

type LoginType = z.infer<typeof loginSchema>;

export default function Login() {
  const auth = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>();
  const { toast } = useToast();
  const t = useTranslations('login');
  const isWithinPage = useOriginTracker();

  const login = useForm<LoginType>({
    resolver: zodResolver(loginSchema),
  });

  const handleSignIn = async (data: LoginType) => {
    try {
      setLoading(true);
      await auth.login(data);
      router.back();
    } catch (error) {
      setLoading(false);
      toast({ title: t('unauthorized') });
    }
  };

  return (
    <Dialog
      open
      onOpenChange={() =>
        isWithinPage
          ? router.back()
          : router.push('/', { forceOptimisticNavigation: true } as any)
      }
    >
      <DialogContent onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="text-2xl">{t('title')}</DialogTitle>
          <DialogDescription>{t('description')}</DialogDescription>
        </DialogHeader>
        <form onSubmit={login.handleSubmit(handleSignIn)}>
          <div className="mb-4">
            <div className="flex justify-between mb-2">
              <Label htmlFor="email">{t('login')}</Label>
              {login.formState.errors.login && (
                <span className="text-red-600 text-sm leading-none font-bold">
                  {t('loginError')}
                </span>
              )}
            </div>
            <Input id="login" {...login.register('login')} />
          </div>
          <div className="mb-4">
            <div className="flex justify-between mb-2">
              <Label htmlFor="password">{t('password')}</Label>
              {login.formState.errors.password && (
                <span className="text-red-600 text-sm leading-none font-bold">
                  {t('passwordError')}
                </span>
              )}
            </div>
            <Input id="password" type={'password'} {...login.register('password')} />
          </div>
          <DialogFooter>
            <Button
              disabled={loading}
              type={'submit'}
              loading={loading}
              className="w-full"
            >
              {t('loginSubmit')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
