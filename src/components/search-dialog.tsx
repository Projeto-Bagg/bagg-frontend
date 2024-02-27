'use client';

import { Spinner } from '@/assets';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { CountryFlag } from '@/components/ui/country-flag';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import UserHoverCard from '@/components/user-hovercard';
import axios from '@/services/axios';
import { useQuery } from '@tanstack/react-query';
import { Search as SearchIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/common/navigation';
import { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';

export const Search = () => {
  const [open, setOpen] = useState<boolean>();
  const [query, setQuery] = useState<string>();
  const [debouncedQuery] = useDebounce(query, 1000);
  const [isFirstFetchSucess, setIsFirstFetchSucess] = useState<boolean>();
  const t = useTranslations('header');

  const search = useQuery<FullSearch>({
    queryKey: ['search', debouncedQuery],
    queryFn: async () => {
      const users = (await axios.get<User[]>(`/users/search?q=${debouncedQuery}&count=5`))
        .data;
      const countries = (
        await axios.get<Country[]>(`/countries/search?q=${debouncedQuery}&count=5`)
      ).data;
      const cities = (
        await axios.get<CityFromSearch[]>(`/cities/search?q=${debouncedQuery}&count=5`)
      ).data;

      return {
        users,
        countries,
        cities,
      };
    },
    enabled: !!debouncedQuery,
  });

  useEffect(() => {
    if (isFirstFetchSucess === undefined) {
      setIsFirstFetchSucess(true);
    }
  }, [isFirstFetchSucess, search.data]);

  const onOpenChange = (open: boolean) => {
    setOpen(open);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <Button variant={'ghost'} size={'icon'}>
              <SearchIcon className="h-[1.2rem] w-[1.2rem]" />
            </Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>{t('search.title')}</TooltipContent>
      </Tooltip>
      <DialogContent className="max-w-[48rem] p-6 md:px-10">
        <DialogHeader className="bg-secondary rounded-t-lg -my-6 -mx-10 overflow-hidden py-6 px-10">
          <div className="relative">
            {search.isFetching ? (
              <Spinner
                className={
                  'absolute left-0 top-4 h-[24px] w-[24px] [&>circle]:stroke-foreground'
                }
              />
            ) : (
              <SearchIcon strokeWidth={3.5} className="absolute left-0 top-4" />
            )}

            <Input
              placeholder={t('search.inputPlaceholder')}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-9 text-xl placeholder:text-xl h-14 bg-transparent rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 border-0 border-b-2 border-muted-foreground"
            />
          </div>
        </DialogHeader>
        {isFirstFetchSucess && debouncedQuery && (
          <div className="mt-8 space-y-2">
            <div>
              <h3 className="font-semibold border-b-2 border-primary pb-1 w-fit">
                {t('search.userSearchResults')}
              </h3>
              <div className="space-y-0.5 mt-4">
                {search.data && search.data.users.length > 0 ? (
                  search.data.users.map((user) => (
                    <UserHoverCard user={user} key={user.id}>
                      <Link
                        onClick={() => setOpen(false)}
                        className="block"
                        href={{ params: { slug: user.username }, pathname: '/[slug]' }}
                      >
                        <div className="flex gap-2 bg-primary-foreground hover:bg-secondary rounded-lg transition-all">
                          <Avatar className="rounded-sm bg-muted">
                            <AvatarImage src={user.image} />
                          </Avatar>
                          <div className="flex items-center gap-1">
                            <span className="font-medium">{user.fullName}</span>
                            <span className="text-muted-foreground text-xs">{' • '}</span>
                            <span className="text-xs text-muted-foreground">
                              @{user.username}
                            </span>
                          </div>
                        </div>
                      </Link>
                    </UserHoverCard>
                  ))
                ) : (
                  <span className="text-muted-foreground">{t('search.notFound')}</span>
                )}
              </div>
            </div>
            <div>
              <h3 className="font-semibold border-b-2 border-primary pb-1 w-fit">
                {t('search.countrySearchResults')}
              </h3>
              <div className="space-y-0.5 mt-4">
                {search.data && search.data.countries.length > 0 ? (
                  search.data.countries.map((country, index) => (
                    <Link
                      key={index}
                      onClick={() => setOpen(false)}
                      className="block"
                      href={{
                        params: { slug: country.iso2 },
                        pathname: '/country/[slug]',
                      }}
                    >
                      <div className="flex items-center gap-2 bg-primary-foreground hover:bg-secondary rounded-lg transition-all">
                        <CountryFlag
                          className="h-[40px] w-[53.3px] rounded-lg"
                          iso2={country.iso2}
                          tooltip={country.name}
                        />
                        <span>{country.name}</span>
                      </div>
                    </Link>
                  ))
                ) : (
                  <span className="text-muted-foreground">{t('search.notFound')}</span>
                )}
              </div>
            </div>
            <div>
              <h3 className="font-semibold border-b-2 border-primary pb-1 w-fit">
                {t('search.citySearchResults')}
              </h3>
              <div className="space-y-0.5 mt-4">
                {search.data && search.data.cities.length > 0 ? (
                  search.data.cities.map((city, index) => (
                    <Link
                      key={index}
                      onClick={() => setOpen(false)}
                      className="block"
                      href={{ params: { slug: city.id }, pathname: '/city/[slug]' }}
                    >
                      <div className="flex items-center gap-2 bg-primary-foreground hover:bg-secondary rounded-lg transition-all">
                        <CountryFlag
                          className="h-[40px] w-[53.3px] rounded-lg"
                          iso2={city.iso2}
                          tooltip={city.country}
                        />
                        <div className="flex gap-1 items-baseline">
                          <span>{city.name}</span>
                          <span className="text-sm text-muted-foreground">
                            {city.region}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <span className="text-muted-foreground">{t('search.notFound')}</span>
                )}
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
