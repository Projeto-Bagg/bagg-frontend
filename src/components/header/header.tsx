'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/context/auth-context';
import { SelectTheme } from '@/components/select-theme';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Plus, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MobileNav } from '@/components/header/mobile-nav';
import { Search } from '@/components/search/search-dialog';
import { CountryFlag } from '@/components/ui/country-flag';
import { CreateDiaryPost } from '@/components/create-post/create-diary-post';
import { Link, usePathname, useRouter } from '@/common/navigation';
import { CreateTip } from '@/components/create-post/create-tip';
import { SelectLanguage } from '@/components/select-language';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

export const Header = () => {
  const t = useTranslations();
  const router = useRouter();
  const auth = useAuth();
  const pathname = usePathname();

  return (
    <header className="text-sm m-auto border-b fixed top-0 left-0 right-0 w-full px-4 z-50 bg-background/70">
      <div className="flex m-auto gap-2 sm:gap-4 justify-between items-center max-w-[900px] min-h-[3.75rem] backdrop-blur-xl">
        <nav>
          <ul className="flex gap-6 font-semibold items-center">
            <li>
              <Link href="/" className="font-extrabold text-xl">
                Bagg
              </Link>
            </li>
            <li className="hidden sm:block">
              <Link
                href={'/ranking'}
                className="text-foreground/60 hover:text-foreground/80 transition"
              >
                {t('header.ranking')}
              </Link>
            </li>
          </ul>
        </nav>
        <div className="flex gap-2 items-center">
          {auth.user && (
            <>
              <CreateTip />
              <CreateDiaryPost />
            </>
          )}
          <Search />
          <SelectLanguage />
          <SelectTheme />
          <div className="hidden sm:block">
            {auth.user ? (
              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger data-test="header-dropdown-button">
                    <Avatar>
                      <AvatarImage src={auth.user?.image} />
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="min-w-[10rem]">
                    <Link
                      href={{
                        pathname: '/[slug]',
                        params: { slug: auth.user!.username },
                      }}
                    >
                      <div className="h-[118px] relative p-4 -mx-1 -my-1 border-b">
                        {auth.user?.city?.region.country && (
                          <CountryFlag
                            className="absolute top-0 left-0 w-full h-full gradient-mask-b-[rgba(0,0,0,1.0)_8px] opacity-70"
                            iso2={auth.user.city.region.country.iso2}
                          />
                        )}
                        <div className="flex flex-col items-center justify-center relative">
                          <Avatar className="my-1 h-[48px] w-[48px]">
                            <AvatarImage src={auth.user?.image} />
                          </Avatar>
                          <span data-test="header-username" className="font-semibold">
                            {auth.user?.username}
                          </span>
                        </div>
                      </div>
                    </Link>
                    <div className="mt-3.5 mb-1">
                      <DropdownMenuItem
                        onSelect={() =>
                          router.push({
                            pathname: '/[slug]',
                            params: { slug: auth.user!.username },
                          })
                        }
                      >
                        {t('header.menu.profile')}
                      </DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => router.replace('/settings')}>
                        {t('header.menu.settings')}
                      </DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => auth.logout()}>
                        {t('header.menu.signout')}
                      </DropdownMenuItem>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex gap-2">
                <Link href={'/login'} replace={pathname === '/signup'} prefetch>
                  <Button
                    variant={'ghost'}
                    className="flex gap-2 items-center h-9 cursor-pointer uppercase"
                  >
                    <User className="h-[1.2rem] w-[1.2rem]" />
                    <span className="font-bold">{t('header.login')}</span>
                  </Button>
                </Link>
                <Link href={'/signup'} replace={pathname === '/login'} prefetch>
                  <Button
                    variant={'outline'}
                    className="flex gap-2 items-center h-9 cursor-pointer"
                  >
                    <span className="font-bold uppercase">{t('header.signup')}</span>
                  </Button>
                </Link>
              </div>
            )}
          </div>
          <MobileNav />
        </div>
      </div>
    </header>
  );
};
