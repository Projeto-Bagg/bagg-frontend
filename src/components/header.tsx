'use client';

import React from 'react';
import { useLocale } from 'next-intl';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/context/auth-context';
import { ThemeToggle } from '@/components/theme-toggle';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Plus, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MobileNav } from '@/components/mobile-nav';
import { languages } from '@/common/languages';
import { Search } from '@/components/search/search-dialog';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { CountryFlag } from '@/components/ui/country-flag';
import { CreateDiaryPost } from '@/components/create-post/create-diary-post';
import { Link, usePathname, useRouter } from '@/common/navigation';
import { useParams, useSearchParams } from 'next/navigation';
import { CreateTip } from '@/components/create-post/create-tip';
import {
  PrimitiveSelectTrigger,
  Select,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import queryString from 'query-string';

export const Header = () => {
  const t = useTranslations();
  const router = useRouter();
  const locale = useLocale();
  const auth = useAuth();
  const pathname = usePathname();
  const params = useParams();
  const searchParams = useSearchParams();

  return (
    <header className="text-sm m-auto border-b fixed top-0 left-0 right-0 w-full px-4 sm:px-0 z-50 bg-background/70">
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
            <React.Fragment>
              <CreateTip>
                <button
                  data-test="create-tip"
                  className="text-primary-foreground flex gap-1 h-[1.2rem] px-2 bg-orange-400 items-center rounded-sm"
                >
                  <Plus size={14} strokeWidth={3} />
                  <span className="font-bold text-xs uppercase">
                    {t('create-tip.trigger')}
                  </span>
                </button>
              </CreateTip>
              <CreateDiaryPost>
                <button
                  data-test="create-post"
                  className="text-primary-foreground flex gap-1 h-[1.2rem] px-2 bg-primary items-center rounded-sm"
                >
                  <Plus size={14} strokeWidth={3} />
                  <span className="font-bold text-xs uppercase">
                    {t('create-post.trigger')}
                  </span>
                </button>
              </CreateDiaryPost>
            </React.Fragment>
          )}
          <Search />
          <Select
            defaultValue={locale}
            onValueChange={(lang) =>
              router.replace(
                // @ts-expect-error
                {
                  params: { slug: params.slug as string },
                  pathname,
                  query: queryString.parse(searchParams.toString()) as Record<
                    'string',
                    'string'
                  >,
                },
                { locale: lang },
              )
            }
          >
            <Tooltip>
              <TooltipTrigger
                data-test="locale-select"
                onFocus={(e) => e.preventDefault()}
                asChild
              >
                <PrimitiveSelectTrigger asChild>
                  <Button className="hidden sm:flex" size={'icon'} variant={'ghost'}>
                    <CountryFlag
                      className="w-[1.6rem]"
                      iso2={languages.find((lang) => lang.locale === locale)!.country}
                    />
                  </Button>
                </PrimitiveSelectTrigger>
              </TooltipTrigger>
              <TooltipContent>{t('header.languages')}</TooltipContent>
            </Tooltip>
            <SelectContent>
              {languages.map((lang) => (
                <SelectItem data-test={lang.locale} key={lang.locale} value={lang.locale}>
                  <div className="flex gap-2">
                    <CountryFlag iso2={lang.country} />
                    <span>{lang.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <ThemeToggle />
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
                          <span data-test="header-username" className="font-medium">
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
