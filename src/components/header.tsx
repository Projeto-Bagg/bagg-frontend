'use-client';

import React, { FormEvent } from 'react';
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
import { Check, Search } from 'lucide-react';

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

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const q = (e.currentTarget[0] as HTMLInputElement).value;

    if (!q) {
      return;
    }

    router.push({ pathname: '/search', query: { q } });

    e.currentTarget.reset();
  };

  return (
    <header className="text-sm border-b h-14">
      <div className="container px-8 flex gap-4 justify-between items-center h-full">
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
          <form className="relative" onSubmit={handleSearch}>
            <Input placeholder={t('input_placeholder')} />
            <button type="submit" className="absolute top-3 right-3">
              <Search size={16} />
            </button>
          </form>
          <ThemeToggle />
          {auth.isAuthenticated ? (
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
                      <DropdownMenuItem
                        className="flex justify-between"
                        onSelect={(e) => {
                          e.preventDefault();
                          changeLanguage('pt');
                        }}
                      >
                        <span>Português</span>
                        {router.locale === 'pt' && <Check size={14} />}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="flex justify-between"
                        onSelect={(e) => {
                          e.preventDefault();
                          changeLanguage('en');
                        }}
                      >
                        <span>English</span>
                        {router.locale === 'en' && <Check size={14} />}
                      </DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>
                  <DropdownMenuItem onSelect={() => router.push('/config')}>
                    {t('menu.settings')}
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
