'use client';

import React, { useEffect, useState } from 'react';
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { ChevronsUpDown, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDebounce } from 'use-debounce';
import { useQuery } from '@tanstack/react-query';
import axios from '@/services/axios';
import { CountryFlag } from '@/components/ui/country-flag';
import { useTranslations } from 'next-intl';
import { ScrollArea, ScrollAreaViewport } from '@/components/ui/scroll-area';

interface SelectCityProps {
  onSelect: (value: string | undefined) => void;
  defaultValue?: City;
}

export const SelectCity = ({ onSelect, defaultValue }: SelectCityProps) => {
  const t = useTranslations();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState<string>();
  const [debouncedQuery] = useDebounce(query, 1000);
  const [selectedCity, setSelectedCity] = React.useState<CityFromSearch | undefined>();

  const enabled = !!debouncedQuery;

  const cities = useQuery<CityFromSearch[]>({
    queryKey: ['search-city', debouncedQuery],
    queryFn: async () =>
      (
        await axios.get<CityFromSearch[]>(`/cities/search`, {
          params: {
            q: debouncedQuery,
            count: 5,
          },
        })
      ).data,
    enabled,
  });

  const isLoading = enabled && cities.isLoading;

  useEffect(() => {
    setSelectedCity(
      defaultValue
        ? {
            id: defaultValue.id,
            country: defaultValue.region.country.name,
            iso2: defaultValue.region.country.iso2,
            latitude: defaultValue.latitude,
            longitude: defaultValue.longitude,
            name: defaultValue.name,
            region: defaultValue.region.name,
          }
        : undefined,
    );
  }, [defaultValue]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline-ring"
          role="combobox"
          data-test="select-city"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedCity ? (
            <div className="flex gap-2">
              <CountryFlag iso2={selectedCity.iso2} />
              <div className="flex gap-1">
                <span>{selectedCity.name}</span>
                <span className="text-muted-foreground">{selectedCity.region}</span>
              </div>
            </div>
          ) : (
            <span className="text-muted-foreground">{t('select-city.title')}</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-full">
        <ScrollArea>
          <ScrollAreaViewport className="max-h-[440px]">
            <Command shouldFilter={false}>
              <div className="relative">
                <CommandInput
                  onValueChange={setQuery}
                  value={query}
                  placeholder={t('select-city.search')}
                />
                {selectedCity && (
                  <XCircle
                    data-test="remove-selected-city"
                    onClick={() => {
                      onSelect(undefined);
                      setSelectedCity(undefined);
                    }}
                    className="absolute top-4 cursor-pointer right-2 w-4 h-4 text-muted-foreground"
                  />
                )}
              </div>
              <CommandGroup>
                {isLoading && (
                  <div className="p-4 text-sm">{t('select-city.searching')}</div>
                )}
                {!cities.isError && !isLoading && !cities.data?.length && (
                  <div className="p-4 text-sm">{t('select-city.not-found')}</div>
                )}
                {cities.isError && (
                  <div className="p-4 text-sm">{t('select-city.error')}</div>
                )}
                {cities.data?.map((city) => (
                  <CommandItem
                    key={city.id}
                    value={city.id.toString()}
                    onSelect={(currentValue) => {
                      setSelectedCity(
                        currentValue === selectedCity?.id.toString() ? undefined : city,
                      );
                      onSelect(
                        currentValue === selectedCity?.id.toString()
                          ? undefined
                          : currentValue,
                      );
                      setOpen(false);
                    }}
                  >
                    <span
                      className={cn(
                        'mr-2 flex h-[18px] w-[18px] items-center justify-center',
                        selectedCity?.id === city.id ? 'opacity-100' : 'opacity-0',
                      )}
                    >
                      <span className="w-[3px] h-full rounded-xl bg-primary" />
                    </span>
                    <div className="flex gap-2">
                      <CountryFlag iso2={city.iso2} />
                      <div className="flex gap-1">
                        <span>{city.name}</span>
                        <span className="text-muted-foreground">{city.region}</span>
                      </div>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </ScrollAreaViewport>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};
