'use client';

import React from 'react';
import Link from 'next-intl/link';
import { useRouter } from 'next-intl/client';
import { usePathname } from 'next-intl/client';
import { useLocale } from 'next-intl';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/context/auth-context';
import { ThemeToggle } from '@/components/theme-toggle';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MobileNav } from '@/components/mobile-nav';
import { languages } from '@/common/languages';
import { Search } from '@/components/search-dialog';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { CountryFlag } from '@/components/ui/country-flag';

export const Header = () => {
  const t = useTranslations('header');
  const auth = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

  return (
    <div className="text-sm border-b">
      <header className="container h-[3.75rem] px-4 lg:px-8 flex gap-2 lg:gap-4 justify-between items-center">
        <nav>
          <ul className="flex gap-2 lg:gap-6 font-semibold items-center">
            <li>
              <Link href="/" className="font-extrabold text-xl">
                Bagg
              </Link>
            </li>
            <li className="hidden lg:block">
              <Link
                href="/ranking"
                className="text-foreground/60 hover:text-foreground/80 transition"
              >
                {t('ranking')}
              </Link>
            </li>
            <li className="hidden lg:block">
              <Link
                href="/countries"
                className="text-foreground/60 hover:text-foreground/80 transition"
              >
                {t('countries')}
              </Link>
            </li>
          </ul>
        </nav>
        <div className="flex gap-2 items-center">
          <Search />
          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button className="hidden md:flex" size={'icon'} variant={'ghost'}>
                    <CountryFlag
                      iso2={languages.find((lang) => lang.locale === locale)!.country}
                    />
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent>{t('languages')}</TooltipContent>
            </Tooltip>
            <DropdownMenuContent>
              {languages.map((lang) => (
                <Link key={lang.locale} href={pathname} locale={lang.locale}>
                  <DropdownMenuItem data-active={lang.locale === locale}>
                    <div className="flex gap-2">
                      <CountryFlag iso2={lang.country} />
                      <span>{lang.label}</span>
                    </div>
                  </DropdownMenuItem>
                </Link>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <ThemeToggle />
          <div className="hidden md:block">
            {auth.isAuthenticated ? (
              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <Avatar>
                      <AvatarImage src={auth.user?.image} />
                      <AvatarFallback>
                        {auth.user?.fullName.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="min-w-[10rem]">
                    <Link href={'/' + auth.user?.username}>
                      <div className="h-[118px] p-4 bg-secondary flex flex-col items-center justify-center -mx-1 -my-1 overflow-hidden">
                        <Avatar className="my-1 h-[48px] w-[48px]">
                          <AvatarFallback>
                            {auth.user?.fullName.charAt(0).toUpperCase()}
                          </AvatarFallback>
                          <AvatarImage src={auth.user?.image} />
                        </Avatar>
                        <span className="font-medium">{auth.user?.username}</span>
                      </div>
                    </Link>
                    <div className="mt-3.5 mb-1">
                      <DropdownMenuItem
                        onSelect={() => router.push('/' + auth.user?.username)}
                      >
                        {t('menu.profile')}
                      </DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => router.push('/config')}>
                        {t('menu.settings')}
                      </DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => auth.logout()}>
                        {t('menu.signout')}
                      </DropdownMenuItem>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex gap-2">
                <Link href={'/login'} prefetch>
                  <Button
                    variant={'outline'}
                    className="flex gap-2 items-center h-9 cursor-pointer uppercase"
                  >
                    <User className="h-[1.2rem] w-[1.2rem]" />
                    <span className="font-bold">{t('login')}</span>
                  </Button>
                </Link>
                <Link href={'/signup'} prefetch>
                  <Button
                    variant={'ghost'}
                    className="flex gap-2 items-center h-9 cursor-pointer"
                  >
                    <span className="font-bold uppercase">{t('signup')}</span>
                  </Button>
                </Link>
              </div>
            )}
          </div>
          <MobileNav />
        </div>
      </header>
    </div>
  );
};
