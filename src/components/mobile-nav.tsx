import React, { useState } from 'react';
import Link, { LinkProps } from 'next/link';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useAuth } from '@/context/auth-context';
import { cn } from '@/lib/utils';
import { Menu } from 'lucide-react';

export const MobileNav = () => {
  const auth = useAuth();
  const [open, setOpen] = useState<boolean>();
  const t = useTranslations('header');

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Menu className="lg:hidden" />
      </SheetTrigger>
      <SheetContent>
        <SheetHeader className="text-left mb-4">
          <SheetTitle>
            <MobileLink onOpenChange={setOpen} href={'/'}>
              <span className="font-bold">Bagg</span>
            </MobileLink>
          </SheetTitle>
        </SheetHeader>
        {auth.isAuthenticated ? (
          <div>
            <div className="flex gap-2 justify-between items-center">
              <div className="flex gap-2 items-center">
                <Avatar className="h-[48px] w-[48px]">
                  <AvatarFallback>
                    {auth.user?.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                  <AvatarImage src={auth.user?.image} />
                </Avatar>
                <div>
                  <span className="text-sm">@{auth.user?.username}</span>
                  <p className="text-xs text-muted-foreground">{auth.user?.fullName}</p>
                </div>
              </div>
              <div>
                <button onClick={auth.logout} className="text-sm">
                  {t('menu.signout')}
                </button>
              </div>
            </div>
            <div className="space-y-3 flex flex-col mt-3">
              <MobileLink onOpenChange={setOpen} href={'/' + auth.user?.username}>
                {t('menu.profile')}
              </MobileLink>
              <MobileLink onOpenChange={setOpen} href={'/config'}>
                {t('menu.settings')}
              </MobileLink>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex flex-col space-y-3">
              <MobileLink onOpenChange={setOpen} href={'/login'}>
                {t('login')}
              </MobileLink>
              <MobileLink onOpenChange={setOpen} href={'/signup'}>
                {t('signup')}
              </MobileLink>
            </div>
          </div>
        )}
        <Separator className="my-3" />
        <div className="space-y-3 flex flex-col">
          <MobileLink onOpenChange={setOpen} href={'/'}>
            {t('home')}
          </MobileLink>
          <MobileLink onOpenChange={setOpen} href={'/ranking'}>
            {t('ranking')}
          </MobileLink>
          <MobileLink onOpenChange={setOpen} href={'/countries'}>
            {t('countries')}
          </MobileLink>
        </div>
      </SheetContent>
    </Sheet>
  );
};

interface MobileLinkProps extends LinkProps {
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
  className?: string;
}

function MobileLink({
  href,
  onOpenChange,
  className,
  children,
  ...props
}: MobileLinkProps) {
  const router = useRouter();
  return (
    <Link
      href={href}
      onClick={() => {
        router.push(href.toString());
        onOpenChange?.(false);
      }}
      className={cn(className)}
      {...props}
    >
      {children}
    </Link>
  );
}
