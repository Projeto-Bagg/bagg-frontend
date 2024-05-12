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
import { ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDebounce } from 'use-debounce';
import { useQuery } from '@tanstack/react-query';
import axios from '@/services/axios';
import { useTranslations } from 'next-intl';
import { ScrollArea, ScrollAreaViewport } from '@/components/ui/scroll-area';

interface SelectCountryProps {
  onSelect: (value: Continent | undefined) => void;
  defaultContinentId?: number;
}

export const SelectContinent = ({ onSelect, defaultContinentId }: SelectCountryProps) => {
  const t = useTranslations();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState<string>();
  const [selectedContinent, setSelectedContinent] = useState<Continent | undefined>();
  const [debouncedQuery] = useDebounce(query, 1000);

  const continents = useQuery<Continent[]>({
    queryKey: ['search-continent', debouncedQuery],
    queryFn: async () => (await axios.get<Continent[]>(`/continents`)).data,
  });

  useEffect(() => {
    continents.data &&
      setSelectedContinent(
        continents.data.find((continent) => continent.id === defaultContinentId),
      );
  }, [defaultContinentId, continents.data]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          data-test="select-continent"
          variant="outline-ring"
          role="combobox"
          aria-expanded={open}
          className="flex justify-between w-full"
        >
          {selectedContinent ? (
            <div className="flex gap-2 w-[83%]">
              <span className="whitespace-nowrap text-ellipsis overflow-hidden">
                {t(`continents.${selectedContinent.name}`)}
              </span>
            </div>
          ) : (
            <span className="text-muted-foreground whitespace-nowrap overflow-hidden w-[83%]">
              {t('select-continent.title')}
            </span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <ScrollArea>
          <ScrollAreaViewport className="max-h-[440px]">
            <Command>
              <CommandInput
                onValueChange={setQuery}
                value={query}
                placeholder={t('select-continent.search')}
              />
              <CommandGroup>
                {!continents.isError &&
                  !continents.isLoading &&
                  !continents.data?.length && (
                    <div className="p-4 text-sm">{t('select-continent.not-found')}</div>
                  )}
                {continents.isError && (
                  <div className="p-4 text-sm">{t('select-continent.error')}</div>
                )}
                <CommandItem
                  onSelect={() => {
                    setSelectedContinent(undefined);
                    onSelect(undefined);
                    setOpen(false);
                  }}
                >
                  <span
                    className={cn(
                      'mr-2 flex h-[18px] w-[18px] items-center justify-center',
                      !selectedContinent ? 'opacity-100' : 'opacity-0',
                    )}
                  >
                    <span className="w-[3px] h-full rounded-xl bg-primary" />
                  </span>
                  <span>{t('select-continent.title')}</span>
                </CommandItem>
                {continents.data?.map((continent) => (
                  <CommandItem
                    key={continent.id}
                    value={continent.name}
                    onSelect={(currentValue) => {
                      setSelectedContinent(
                        currentValue === selectedContinent?.name ? undefined : continent,
                      );
                      onSelect(continent);
                      setOpen(false);
                    }}
                  >
                    <span
                      className={cn(
                        'mr-2 flex h-[18px] w-[18px] items-center justify-center',
                        selectedContinent?.name === continent.name
                          ? 'opacity-100'
                          : 'opacity-0',
                      )}
                    >
                      <span className="w-[3px] h-full rounded-xl bg-primary" />
                    </span>
                    <div className="flex gap-2">
                      <span className="w-[216px] whitespace-nowrap text-ellipsis overflow-hidden">
                        {t(`continents.${continent.name}`)}
                      </span>
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
