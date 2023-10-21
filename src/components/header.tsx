'use client';

import React, { useState } from 'react';
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
import { MobileNav } from '@/components/mobile-nav';
import { useQuery } from '@tanstack/react-query';
import axios from '@/services/axios';
import { useDebounce } from 'use-debounce';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';

export const Header = () => {
  const t = useTranslations('header');
  const auth = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const [query, setQuery] = useState<string>();
  const [debouncedQuery] = useDebounce(query, 1000);
  const [popoverOpen, setPopoverOpen] = useState<boolean>();

  const search = useQuery<User[]>(
    ['search', debouncedQuery],
    async () => (await axios.get<User[]>('/users/search/' + debouncedQuery)).data,
    {
      enabled: !!debouncedQuery,
    },
  );

  console.log({ debouncedQuery, loading: search.isLoading, data: search.data });

  const changeLanguage = (locale: string) => {
    router.replace(pathname, { locale });
  };

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
                Ranking
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
          <div className="relative">
            <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
              <PopoverTrigger onClick={(e) => popoverOpen && e.preventDefault()}>
                <Input
                  className="lg:min-w-[288px]"
                  placeholder={t('search.inputPlaceholder')}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <button type="submit" className="absolute top-3 right-3">
                  <Search size={16} />
                </button>
              </PopoverTrigger>
              <PopoverContent
                className="mt-0.5 shadow-lg"
                onOpenAutoFocus={(e) => e.preventDefault()}
              >
                <span className="text-sm">
                  {t('search.emptySearch')}{' '}
                  <span className="font-bold">{debouncedQuery || '...'}</span>
                </span>
                {debouncedQuery &&
                  !search.isLoading &&
                  (search.data ? (
                    search.data.map((user) => (
                      <Link
                        key={user.id}
                        href={'/' + user.username}
                        onClick={() => setPopoverOpen(false)}
                      >
                        <Separator className="my-3" />
                        <div className="flex gap-2">
                          <Avatar>
                            <AvatarFallback>
                              {user.fullName.charAt(0).toUpperCase()}
                            </AvatarFallback>
                            <AvatarImage src={user.image} />
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="font-medium">{user.fullName}</span>
                            <span className="text-xs text-muted-foreground">
                              @{user.username}
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div>
                      <Separator className="my-3" />
                      <span className="text-sm">{t('search.notFound')}</span>
                    </div>
                  ))}
              </PopoverContent>
            </Popover>
          </div>
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
                  <DropdownMenuContent>
                    <DropdownMenuLabel>@{auth.user?.username}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onSelect={() => router.push('/' + auth.user?.username)}
                    >
                      {t('menu.profile')}
                    </DropdownMenuItem>
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger>
                        {t('menu.language')}
                      </DropdownMenuSubTrigger>
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
