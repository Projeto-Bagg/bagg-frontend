import React, { useState } from 'react';
import Link, { LinkProps } from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import IntlLink from 'next-intl/link';
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
import { languages } from '@/common/languages';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { usePathname } from 'next-intl/client';
import { CountryFlag } from '@/components/ui/country-flag';
import { useTheme } from 'next-themes';
import {
  BarChart,
  Check,
  ChevronsUpDown,
  Home,
  LogIn,
  MapPin,
  Settings,
  User2,
} from 'lucide-react';

export const MobileNav = () => {
  const auth = useAuth();
  const [open, setOpen] = useState<boolean>();
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations('header');
  const { themes, theme: activeTheme, setTheme } = useTheme();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger className="md:hidden">
        <Avatar>
          <AvatarFallback>
            {auth.user ? (
              auth.user.fullName.charAt(0).toUpperCase()
            ) : (
              <User2 className="h-[1.2rem] w-[1.2rem]" />
            )}
          </AvatarFallback>
          <AvatarImage src={auth.user?.image} />
        </Avatar>
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
                <Avatar className="h-[72px] w-[72px]">
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
            <div className="space-y-3 flex flex-col mt-4">
              <MobileLink onOpenChange={setOpen} href={'/' + auth.user?.username}>
                <div className="flex items-center gap-2">
                  <User2 size={20} />
                  <span>{t('menu.profile')}</span>
                </div>
              </MobileLink>
              <MobileLink onOpenChange={setOpen} href={'/config'}>
                <div className="flex items-center gap-2">
                  <Settings size={20} />
                  <span>{t('menu.settings')}</span>
                </div>
              </MobileLink>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex flex-col space-y-3">
              <MobileLink onOpenChange={setOpen} href={'/login'}>
                <div className="flex items-center gap-2">
                  <LogIn size={20} />
                  <span>{t('login')}</span>
                </div>
              </MobileLink>
              <MobileLink onOpenChange={setOpen} href={'/signup'}>
                <div className="flex items-center gap-2">
                  <User2 size={20} />
                  <span>{t('signup')}</span>
                </div>
              </MobileLink>
            </div>
          </div>
        )}
        <Separator className="my-3" />
        <div className="space-y-3 flex flex-col">
          <MobileLink onOpenChange={setOpen} href={'/'}>
            <div className="flex items-center gap-2">
              <Home size={20} />
              <span>{t('home')}</span>
            </div>
          </MobileLink>
          <MobileLink onOpenChange={setOpen} href={'/ranking'}>
            <div className="flex items-center gap-2">
              <BarChart size={20} />
              <span>{t('ranking')}</span>
            </div>
          </MobileLink>
          <MobileLink onOpenChange={setOpen} href={'/countries'}>
            <div className="flex items-center gap-2">
              <MapPin size={20} />
              <span>{t('countries')}</span>
            </div>
          </MobileLink>
          <Separator />
          <Collapsible>
            <CollapsibleTrigger asChild>
              <button className="flex w-full justify-between items-center">
                <span>{t('languages')}</span>
                <ChevronsUpDown size={20} />
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              {languages.map((lang) => (
                <IntlLink
                  href={pathname}
                  key={lang.locale}
                  className="ml-3 mt-2 flex justify-between"
                  locale={lang.locale}
                >
                  <div className="flex gap-2">
                    <CountryFlag iso2={lang.country} />
                    <span className="text-muted-foreground">{lang.label}</span>
                  </div>
                  {lang.locale === locale && <Check size={20} className="text-primary" />}
                </IntlLink>
              ))}
            </CollapsibleContent>
          </Collapsible>
          <Collapsible>
            <CollapsibleTrigger asChild>
              <button className="flex w-full justify-between items-center">
                <span>{t('themes.title')}</span>
                <ChevronsUpDown size={20} />
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              {themes.map((theme) => (
                <div key={theme} className="ml-3 mt-2 flex justify-between">
                  <button
                    onClick={() => setTheme(theme)}
                    className="text-muted-foreground"
                  >
                    {t(`themes.${theme as 'dark' | 'light' | 'system'}`)}
                  </button>
                  {activeTheme === theme && <Check size={20} className="text-primary" />}
                </div>
              ))}
            </CollapsibleContent>
          </Collapsible>
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
