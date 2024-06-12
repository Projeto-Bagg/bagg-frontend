'use client';

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
import { Search as SearchIcon, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
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
import { getCookie } from 'cookies-next';
import {
  useClearRecentSearches,
  useDeleteQueryFromRecentSearches,
  useSaveQueryOnRecentSearches,
} from '@/hooks/recent-searches';

export const Search = () => {
  const [open, setOpen] = useState<boolean>();
  const [query, setQuery] = useState<string>();
  const [debouncedQuery] = useDebounce(query, 500);
  const [isFirstFetchSucess, setIsFirstFetchSucess] = useState<boolean>();
  const t = useTranslations('header');

  const recentSearches = useQuery<RecentSearch[]>({
    queryKey: ['recent-searches'],
    queryFn: () =>
      JSON.parse(getCookie('bagg.recent-searches') || '[]') as RecentSearch[],
  });
  const saveQueryOnRecentSearches = useSaveQueryOnRecentSearches();
  const deleteQueryFromRecentSearches = useDeleteQueryFromRecentSearches();
  const clearRecentSearches = useClearRecentSearches();

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
    placeholderData: (data) => data,
  });

  useEffect(() => {
    if (isFirstFetchSucess === undefined) {
      setIsFirstFetchSucess(true);
    }
  }, [isFirstFetchSucess, search.data]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
      <DialogContent className="sm:max-w-[48rem] p-0 sm:p-0">
        <DialogHeader className="bg-secondary shrink-0 rounded-t-lg overflow-hidden py-6 px-4 sm:px-10">
          <div className="relative">
            {search.isFetching ? (
              <img
                alt=""
                src={'/spinner.svg'}
                className={'absolute left-0 top-4 h-[24px] w-[24px] invert dark:invert-0'}
              />
            ) : (
              <SearchIcon strokeWidth={3.5} className="absolute left-0 top-4" />
            )}
            <Input
              placeholder={t('search.input-placeholder')}
              value={query || ''}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-9 text-xl placeholder:text-xl h-14 bg-transparent rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 border-0 border-b-2 border-muted-foreground"
            />
          </div>
        </DialogHeader>
        {!(isFirstFetchSucess && debouncedQuery) &&
          recentSearches.data &&
          recentSearches.data.length > 0 && (
            <div className="px-4 sm:px-10 py-4 pt-0">
              <div className="flex justify-between items-baseline">
                <div className="mb-4">
                  <h2 className="font-bold w-fit text-base border-b-2 border-primary pb-1">
                    {t('search.recents')}
                  </h2>
                </div>
                <div>
                  <button
                    data-test="clear-all"
                    onClick={() => clearRecentSearches.mutate()}
                    className="text-primary hover:brightness-125 transition-all font-semibold"
                  >
                    {t('search.clear-all')}
                  </button>
                </div>
              </div>
              <div data-test="recent-searches" className="space-y-1">
                {recentSearches.data.map((recent, index) => (
                  <div className="text-base w-full flex justify-between" key={index}>
                    <div className="w-full mr-4 sm:mr-8">
                      {determineIfIsUser(recent.element) ? (
                        <UserSearch
                          onClick={() => {
                            saveQueryOnRecentSearches.mutate(recent.element);
                            setOpen(false);
                          }}
                          user={recent.element}
                        />
                      ) : determineIfIsCountry(recent.element) ? (
                        <CountrySearch
                          onClick={() => {
                            saveQueryOnRecentSearches.mutate(recent.element);
                            setOpen(false);
                          }}
                          country={recent.element}
                        />
                      ) : (
                        <CitySearch
                          onClick={() => {
                            saveQueryOnRecentSearches.mutate(recent.element);
                            setOpen(false);
                          }}
                          city={recent.element}
                        />
                      )}
                    </div>
                    <button onClick={() => deleteQueryFromRecentSearches.mutate(index)}>
                      <X className="w-5 text-muted-foreground" strokeWidth={2.5} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        {isFirstFetchSucess && debouncedQuery && (
          <ScrollArea>
            <ScrollAreaViewport className="max-h-[calc(80vh-120px)] sm:max-h-[700px] px-4 sm:px-10 py-4 pt-0">
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
                                <TipSearch
                                  setOpen={setOpen}
                                  tip={tip}
                                  boldMessage={debouncedQuery}
                                />
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
                            <UserSearch
                              key={user.username}
                              onClick={() => {
                                saveQueryOnRecentSearches.mutate(user);
                                setOpen(false);
                              }}
                              user={user}
                            />
                          ))}
                        </div>
                        <SeeMore
                          className="w-fit"
                          onClick={() => {
                            setOpen(false);
                          }}
                          href={{
                            pathname: '/search/user',
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
                            <CountrySearch
                              key={index}
                              onClick={() => {
                                saveQueryOnRecentSearches.mutate(country);
                                setOpen(false);
                              }}
                              country={country}
                            />
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
                            <CitySearch
                              key={index}
                              onClick={() => {
                                saveQueryOnRecentSearches.mutate(city);
                                setOpen(false);
                              }}
                              city={city}
                            />
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

const determineIfIsCountry = (
  toBeDetermined: Country | CityFromSearch | User,
): toBeDetermined is Country => {
  if ((toBeDetermined as Country).capital) {
    return true;
  }
  return false;
};

const determineIfIsUser = (
  toBeDetermined: Country | CityFromSearch | User,
): toBeDetermined is User => {
  if ((toBeDetermined as User).username) {
    return true;
  }
  return false;
};
