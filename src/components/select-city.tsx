import React, { useState } from 'react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
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

interface SelectCityProps {
  onSelect: (value: string) => void;
}

export default function SelectCity({ onSelect }: SelectCityProps) {
  const [open, setOpen] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState<string>();
  const [query, setQuery] = useState<string>();
  const [debouncedQuery] = useDebounce(query, 1000);
  const t = useTranslations('selectCity');

  const enabled = !!debouncedQuery;

  const cities = useQuery<CityFromSearch[]>({
    queryKey: ['search', debouncedQuery],
    queryFn: async () =>
      (await axios.get<CityFromSearch[]>(`/cities/search?q=${debouncedQuery}&count=5`))
        .data,
    enabled,
  });

  const isLoading = enabled && cities.isLoading;

  const selectedCity = cities.data?.find((city) => city.id.toString() === selectedValue);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {cities.data && selectedValue && selectedCity ? (
            <div className="flex gap-2">
              <CountryFlag iso2={selectedCity.iso2} />
              <div className="flex gap-1">
                <span>{selectedCity.name}</span>
                <span className="text-muted-foreground">{selectedCity.region}</span>
              </div>
            </div>
          ) : (
            t('title')
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-full">
        <Command shouldFilter={false}>
          <CommandInput
            onValueChange={setQuery}
            value={query}
            placeholder={t('search')}
          />
          <CommandGroup>
            {isLoading && <div className="p-4 text-sm">{t('searching')}</div>}
            {!cities.isError && !isLoading && !cities.data?.length && (
              <div className="p-4 text-sm">{t('notFound')}</div>
            )}
            {cities.isError && <div className="p-4 text-sm">{t('error')}</div>}
            {cities.data?.map((city) => (
              <CommandItem
                key={city.id}
                value={city.id.toString()}
                onSelect={(currentValue) => {
                  setSelectedValue(currentValue === selectedValue ? '' : currentValue);
                  onSelect(currentValue);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    'mr-2 h-4 w-4',
                    selectedValue === city.id.toString() ? 'opacity-100' : 'opacity-0',
                  )}
                />
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
      </PopoverContent>
    </Popover>
  );
}
