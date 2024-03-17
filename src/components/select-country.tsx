import React, { useEffect, useState } from 'react';
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDebounce } from 'use-debounce';
import { useQuery } from '@tanstack/react-query';
import axios from '@/services/axios';
import { CountryFlag } from '@/components/ui/country-flag';
import { useTranslations } from 'next-intl';
import { ScrollArea } from '@/components/ui/scroll-area';

interface SelectCountryProps {
  onSelect: (value: Country) => void;
  defaultIso2?: string;
}

export const SelectCountry = ({ onSelect, defaultIso2 }: SelectCountryProps) => {
  const t = useTranslations();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState<string>();
  const [selectedCountry, setSelectedCountry] = useState<Country | undefined>();
  const [debouncedQuery] = useDebounce(query, 1000);

  const countries = useQuery<Country[]>({
    queryKey: ['search-country', debouncedQuery],
    queryFn: async () => (await axios.get<Country[]>(`/countries`)).data,
  });

  useEffect(() => {
    countries.data &&
      setSelectedCountry(countries.data.find((country) => country.iso2 === defaultIso2));
  }, [defaultIso2, countries.data]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline-ring"
          role="combobox"
          aria-expanded={open}
          className="flex justify-between w-full"
        >
          {selectedCountry ? (
            <div className="flex gap-2 w-[83%]">
              <CountryFlag className="shrink-0" iso2={selectedCountry.iso2} />
              <span className="whitespace-nowrap text-ellipsis overflow-hidden">
                {selectedCountry.name}
              </span>
            </div>
          ) : (
            <span className="text-muted-foreground whitespace-nowrap overflow-hidden w-[83%]">
              {t('select-country.title')}
            </span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <ScrollArea className="h-[440px]">
          <Command>
            <CommandInput
              onValueChange={setQuery}
              value={query}
              placeholder={t('select-country.search')}
            />
            <CommandGroup>
              {!countries.isError && !countries.isLoading && !countries.data?.length && (
                <div className="p-4 text-sm">{t('select-country.not-found')}</div>
              )}
              {countries.isError && (
                <div className="p-4 text-sm">{t('select-country.error')}</div>
              )}
              {countries.data?.map((country) => (
                <CommandItem
                  key={country.id}
                  value={country.name}
                  onSelect={(currentValue) => {
                    setSelectedCountry(
                      currentValue === selectedCountry?.name ? undefined : country,
                    );
                    onSelect(country);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      selectedCountry?.name === country.name
                        ? 'opacity-100'
                        : 'opacity-0',
                    )}
                  />
                  <div className="flex gap-2">
                    <CountryFlag iso2={country.iso2} />
                    <span className="w-[216px] whitespace-nowrap text-ellipsis overflow-hidden">
                      {country.name}
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};
