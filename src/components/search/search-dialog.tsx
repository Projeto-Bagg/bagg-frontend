'use client';

import { Spinner } from '@/assets';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import axios from '@/services/axios';
import { useQuery } from '@tanstack/react-query';
import { Search as SearchIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/common/navigation';
import { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';
import { SeeMore } from '@/components/see-more';
import { ScrollArea, ScrollAreaViewport } from '@/components/ui/scroll-area';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { TipSearch } from '@/components/search/tip-search';
import { UserSearch } from '@/components/search/user-search';
import { CountrySearch } from '@/components/search/country-search';
import { CitySearch } from '@/components/search/city-search';

export const Search = () => {
  const [open, setOpen] = useState<boolean>();
  const [query, setQuery] = useState<string>();
  const [debouncedQuery] = useDebounce(query, 1000);
  const [isFirstFetchSucess, setIsFirstFetchSucess] = useState<boolean>();
  const t = useTranslations('header');

  const search = useQuery<FullSearch>({
    queryKey: ['search', debouncedQuery],
    queryFn: async () => {
      const tips = (
        await axios.get<Tip[]>(`/tips/search`, {
          params: {
            q: debouncedQuery,
            count: 5,
          },
        })
      ).data;
      const users = (
        await axios.get<User[]>(`/users/search`, {
          params: {
            q: debouncedQuery,
            count: 5,
          },
        })
      ).data;
      const countries = (
        await axios.get<Country[]>(`/countries/search`, {
          params: {
            q: debouncedQuery,
            count: 5,
          },
        })
      ).data;
      const cities = (
        await axios.get<CityFromSearch[]>(`/cities/search`, {
          params: {
            q: debouncedQuery,
            count: 5,
          },
        })
      ).data;

      return {
        users,
        countries,
        cities,
        tips,
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
            <Button data-test="search-dialog" variant={'ghost'} size={'icon'}>
              <SearchIcon className="h-[1.2rem] w-[1.2rem]" />
            </Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>{t('search.title')}</TooltipContent>
      </Tooltip>
      <DialogContent className="sm:max-w-[48rem] p-0 sm:0">
        <DialogHeader className="bg-secondary shrink-0 rounded-t-lg overflow-hidden py-6 px-4 sm:px-10">
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
              placeholder={t('search.input-placeholder')}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-9 text-xl placeholder:text-xl h-14 bg-transparent rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 border-0 border-b-2 border-muted-foreground"
            />
          </div>
        </DialogHeader>
        {isFirstFetchSucess && debouncedQuery && (
          <ScrollArea>
            <ScrollAreaViewport className="max-h-[700px] px-4 sm:px-10 py-4 pt-0">
              <div className="space-y-2">
                <div>
                  <h3 className="font-semibold border-b-2 border-primary pb-1 w-fit">
                    {t('search.tip-search-results')}
                  </h3>
                  <div className="mt-4">
                    {search.data && search.data.tips.length > 0 ? (
                      <div>
                        <Carousel className="w-[calc(100vw-32px)] sm:w-[686px]">
                          <CarouselContent>
                            {search.data?.tips.map((tip) => (
                              <CarouselItem className="sm:basis-1/3 text-sm" key={tip.id}>
                                <TipSearch tip={tip} boldMessage={debouncedQuery} />
                              </CarouselItem>
                            ))}
                          </CarouselContent>
                          <CarouselNext className="-right-10" />
                          <CarouselPrevious className="-left-10" />
                        </Carousel>
                        <SeeMore
                          className="w-fit"
                          onClick={() => {
                            setOpen(false);
                          }}
                          href={{
                            pathname: '/search',
                            query: {
                              q: debouncedQuery,
                            },
                          }}
                        />
                      </div>
                    ) : (
                      <span className="text-muted-foreground">
                        {t('search.not-found')}
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold border-b-2 border-primary pb-1 w-fit">
                    {t('search.user-search-results')}
                  </h3>
                  <div className="mt-4">
                    {search.data && search.data.users.length > 0 ? (
                      <div>
                        <div id="users" className="space-y-0.5 mb-1">
                          {search.data.users.map((user) => (
                            <Link
                              href={{
                                params: { slug: user.username },
                                pathname: '/[slug]',
                              }}
                              key={user.id}
                              onClick={() => setOpen(false)}
                              className="block"
                            >
                              <UserSearch user={user} />
                            </Link>
                          ))}
                        </div>
                        <SeeMore
                          className="w-fit"
                          onClick={() => {
                            setOpen(false);
                          }}
                          href={{
                            pathname: '/search',
                            query: {
                              q: debouncedQuery,
                            },
                          }}
                        />
                      </div>
                    ) : (
                      <span className="text-muted-foreground">
                        {t('search.not-found')}
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold border-b-2 border-primary pb-1 w-fit">
                    {t('search.country-search-results')}
                  </h3>
                  <div className="mt-4">
                    {search.data && search.data.countries.length > 0 ? (
                      <div>
                        <div id="countries" className="space-y-0.5 mb-1">
                          {search.data.countries.map((country, index) => (
                            <Link
                              key={index}
                              onClick={() => setOpen(false)}
                              className="block"
                              href={{
                                params: { slug: country.iso2 },
                                pathname: '/country/[slug]',
                              }}
                            >
                              <CountrySearch country={country} />
                            </Link>
                          ))}
                        </div>
                        <SeeMore
                          className="w-fit"
                          onClick={() => {
                            setOpen(false);
                          }}
                          href={{
                            pathname: '/search/country',
                            query: {
                              q: debouncedQuery,
                            },
                          }}
                        />
                      </div>
                    ) : (
                      <span className="text-muted-foreground">
                        {t('search.not-found')}
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold border-b-2 border-primary pb-1 w-fit">
                    {t('search.city-search-results')}
                  </h3>
                  <div className="mt-4">
                    {search.data && search.data.cities.length > 0 ? (
                      <div>
                        <div id="cities" className="space-y-0.5 mt-4 mb-1">
                          {search.data.cities.map((city, index) => (
                            <Link
                              key={index}
                              onClick={() => setOpen(false)}
                              className="block"
                              href={{
                                params: { slug: city.id },
                                pathname: '/city/[slug]',
                              }}
                            >
                              <CitySearch city={city} />
                            </Link>
                          ))}
                        </div>
                        <SeeMore
                          onClick={() => {
                            setOpen(false);
                          }}
                          className="w-fit"
                          href={{
                            pathname: '/search/city',
                            query: {
                              q: debouncedQuery,
                            },
                          }}
                        />
                      </div>
                    ) : (
                      <span className="text-muted-foreground">
                        {t('search.not-found')}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </ScrollAreaViewport>
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  );
};
