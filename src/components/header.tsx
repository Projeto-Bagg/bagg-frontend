'use-client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/context/auth-context';
import { Signup } from '@/components/signup';
import { Login } from '@/components/login';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { setCookie } from 'cookies-next';

export const Header = () => {
  const t = useTranslations('header');
  const auth = useAuth();
  const router = useRouter();

  const changeLanguage = (locale: string) => {
    setCookie('NEXT_LOCALE', locale);

    router.push({ pathname: router.pathname, query: router.query }, router.asPath, {
      locale,
    });
  };

  return (
    <header className="text-sm border-b h-14">
      <div className="container flex gap-4 px-4 justify-between items-center h-full">
        <nav>
          <ul className="flex gap-8 font-semibold items-center">
            <li>
              <Link href="/" className="font-extrabold text-xl">
                Bagg
              </Link>
            </li>
            <li>
              <Link
                href="/ranking"
                className="text-foreground/60 hover:text-foreground/80 transition"
              >
                Ranking
              </Link>
            </li>
            <li>
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
          <Input placeholder={t('input_placeholder')} />
          <ThemeToggle />
          {auth.isLoading ? (
            <span>Loading...</span>
          ) : auth.isAuthenticated ? (
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Avatar>
                    <AvatarImage src={auth.user?.image} />
                    <AvatarFallback>
                      {auth.user?.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>@{auth.user?.username}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onSelect={() => router.push('/' + auth.user?.username)}
                  >
                    {t('menu.profile')}
                  </DropdownMenuItem>
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>{t('menu.language')}</DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                      <DropdownMenuItem onSelect={() => changeLanguage('pt')}>
                        Português
                      </DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => changeLanguage('en')}>
                        English
                      </DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>
                  <DropdownMenuItem onSelect={() => router.push('/config')}>
                    {t('menu.config')}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onSelect={() => auth.logout()}>
                    {t('menu.signout')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex gap-2">
              <Login />
              <Signup />
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
