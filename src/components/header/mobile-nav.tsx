'use client';

import React, { useState } from 'react';
import Link, { LinkProps } from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
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
import { CountryFlag } from '@/components/ui/country-flag';
import { useTheme } from 'next-themes';
import {
  BarChart,
  Check,
  ChevronsUpDown,
  Home,
  LogIn,
  Settings,
  User2,
} from 'lucide-react';
import { useRouter as useIntlRouter, usePathname } from '@/common/navigation';
import queryString from 'query-string';

export const MobileNav = () => {
  const auth = useAuth();
  const [open, setOpen] = useState<boolean>();
  const locale = useLocale();
  const t = useTranslations('header');
  const { themes, theme: activeTheme, setTheme } = useTheme();
  const pathname = usePathname();
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useIntlRouter();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger data-test="mobile-nav-trigger" className="sm:hidden">
        <Avatar>
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
        {auth.user ? (
          <div>
            <div className="flex gap-2 justify-between items-center">
              <MobileLink onOpenChange={setOpen} href={'/' + auth.user.username}>
                <div className="flex gap-2 items-center">
                  <Avatar className="h-[64px] w-[64px]">
                    <AvatarImage src={auth.user.image} />
                  </Avatar>
                  <div>
                    <span className="text-sm font-semibold">{auth.user.fullName}</span>
                    <p className="text-xs text-muted-foreground">@{auth.user.username}</p>
                  </div>
                </div>
              </MobileLink>
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
              <MobileLink onOpenChange={setOpen} href={'/settings'}>
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
          <Separator />
          <Collapsible>
            <CollapsibleTrigger asChild>
              <button
                data-test="language-collapsible"
                className="flex w-full justify-between items-center"
              >
                <span>{t('languages')}</span>
                <ChevronsUpDown size={20} />
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              {languages.map((lang) => (
                <div key={lang.locale} className="ml-3 mt-2">
                  <button
                    data-test={lang.locale}
                    className="flex justify-between w-full"
                    onClick={() => {
                      router.push(
                        // @ts-expect-error
                        {
                          params: { slug: params.slug as string },
                          pathname,
                          query: queryString.parse(searchParams.toString()) as Record<
                            'string',
                            'string'
                          >,
                        },
                        { locale: lang.locale },
                      );
                      router.refresh();
                    }}
                  >
                    <div className="flex gap-2">
                      <CountryFlag iso2={lang.country} />
                      <span className="text-muted-foreground">{lang.label}</span>
                    </div>
                    {lang.locale === locale && (
                      <Check size={20} className="text-primary" />
                    )}
                  </button>
                </div>
              ))}
            </CollapsibleContent>
          </Collapsible>
          <Collapsible>
            <CollapsibleTrigger data-test="theme-collapsible" asChild>
              <button className="flex w-full justify-between items-center">
                <span>{t('themes.title')}</span>
                <ChevronsUpDown size={20} />
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              {themes.map((theme) => (
                <div key={theme} className="ml-3 mt-2">
                  <button
                    onClick={() => setTheme(theme)}
                    className="text-muted-foreground w-full flex justify-between"
                    data-test={theme}
                  >
                    {t(`themes.${theme as 'dark' | 'light' | 'system'}`)}
                    {activeTheme === theme && (
                      <Check size={20} className="text-primary" />
                    )}
                  </button>
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
