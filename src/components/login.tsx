import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/context/auth-context';
import { User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
  DialogHeader,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useTranslations } from 'next-intl';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(4).max(22),
});

type LoginType = z.infer<typeof loginSchema>;

export const Login = () => {
  const [loading, setLoading] = useState<boolean>();
  const [open, setOpen] = useState<boolean>(false);
  const { toast } = useToast();
  const t = useTranslations('login');

  const auth = useAuth();

  const login = useForm<LoginType>({
    resolver: zodResolver(loginSchema),
  });

  const handleSignIn = async (data: LoginType) => {
    try {
      setLoading(true);
      await auth.login(data);
    } catch (error) {
      setLoading(false);
      toast({ title: 'Erro' });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant={'outline'}
          className="flex gap-2 items-center h-9 cursor-pointer uppercase"
        >
          <User className="h-[1.2rem] w-[1.2rem]" />
          <span className="font-bold">{t('button')}</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-2xl">{t('title')}</DialogTitle>
          <DialogDescription>{t('description')}</DialogDescription>
        </DialogHeader>
        <form onSubmit={login.handleSubmit(handleSignIn)}>
          <div className="mb-4">
            <div className="flex justify-between mb-2">
              <Label htmlFor="email">{t('email')}</Label>
              {login.formState.errors.email && (
                <span className="text-red-600">{t('email_error')}</span>
              )}
            </div>
            <Input id="email" {...login.register('email')} />
          </div>
          <div className="mb-4">
            <div className="flex justify-between mb-2">
              <Label htmlFor="password">{t('password')}</Label>
              {login.formState.errors.password && (
                <span className="text-red-600">{t('password_error')}</span>
              )}
            </div>
            <Input id="password" type={'password'} {...login.register('password')} />
          </div>
          <DialogFooter>
            <Button type={'submit'} className="w-full">
              {t('login')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
