'use client';

import React, { FormEvent } from 'react';
import Link from 'next-intl/link';
import { useRouter } from 'next-intl/client';
import { usePathname } from 'next-intl/client';
import { useLocale } from 'next-intl';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/context/auth-context';
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
} from '@/components/ui/dropdown-menu';
import { Check, Search, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const Header = () => {
  const t = useTranslations('header');
  const auth = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

  const changeLanguage = (locale: string) => {
    router.replace(pathname, { locale });
  };

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const q = (e.currentTarget[0] as HTMLInputElement).value;

    if (!q) {
      return;
    }

    router.push('/search', { query: q });

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
                        {locale === 'pt' && <Check size={14} />}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="flex justify-between"
                        onSelect={(e) => {
                          e.preventDefault();
                          changeLanguage('en');
                        }}
                      >
                        <span>English</span>
                        {locale === 'en' && <Check size={14} />}
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
              <Link href={'/login'}>
                <Button
                  variant={'outline'}
                  className="flex gap-2 items-center h-9 cursor-pointer uppercase"
                >
                  <User className="h-[1.2rem] w-[1.2rem]" />
                  <span className="font-bold">{t('login')}</span>
                </Button>
              </Link>
              <Link href={'/signup'}>
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
      </div>
    </header>
  );
};
