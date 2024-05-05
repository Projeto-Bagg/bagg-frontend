'use client';

import { languages } from '@/common/languages';
import { usePathname, useRouter } from '@/common/navigation';
import { Button } from '@/components/ui/button';
import { CountryFlag } from '@/components/ui/country-flag';
import {
  PrimitiveSelectTrigger,
  Select,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useLocale, useTranslations } from 'next-intl';
import { useParams, useSearchParams } from 'next/navigation';
import React from 'react';
import queryString from 'query-string';

export const SelectLanguage = () => {
  const t = useTranslations();
  const router = useRouter();
  const locale = useLocale();
  const pathname = usePathname();
  const params = useParams();
  const searchParams = useSearchParams();

  return (
    <Select
      defaultValue={locale}
      onValueChange={(lang) => {
        router.push(
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
        );
        router.refresh();
      }}
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
  );
};
