'use client';

import { Link, usePathname, useRouter } from '@/common/navigation';
import { SelectCountry } from '@/components/select-country';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { Calendar, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import React, { ReactNode } from 'react';

export default function Layout({ children }: { children: ReactNode }) {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const date = searchParams.get('date');
  const countryIso2 = searchParams.get('countryIso2');

  const handleChangeDatePreset = (value: string) => {
    // @ts-expect-error
    router.push({
      pathname: pathname,
      params: {
        slug: '',
      },
      query: {
        ...(+value && {
          date: +value,
        }),
        ...(countryIso2 && {
          countryIso2,
        }),
      },
    });
  };

  const handleChangeCountry = (value: Country | undefined) => {
    if (!value) {
      // @ts-expect-error
      return router.push({
        pathname: pathname,
        params: { slug: '' },
        query: {
          ...(date && {
            date: date,
          }),
        },
      });
    }

    // @ts-expect-error
    router.push({
      pathname: pathname,
      params: {
        slug: '',
      },
      query: {
        ...(date &&
          +date && {
            date,
          }),
        countryIso2: value.iso2,
      },
    });
  };

  return (
    <div className="p-4">
      <div className="mb-4">
        <h1 className="font-bold mb-4 w-fit text-xl sm:text-2xl border-b-2 border-primary pb-1">
          {t('ranking.city.title')}
        </h1>
        <div className="flex text-sm flex-col gap-4 sm:mb-4 sm:flex-row justify-between sm:items-end">
          <div className="flex gap-4 font-bold text-muted-foreground">
            <Link
              className={cn(
                pathname.endsWith('rating')
                  ? 'border-b-2 border-blue-600 text-primary'
                  : 'hover:text-foreground transition-all duration-75',
                'py-2 flex justify-center',
              )}
              href={{
                pathname: '/city/ranking/rating',
                query: searchParams.toString(),
              }}
            >
              {t('ranking.city.rating')}
            </Link>
            <Link
              className={cn(
                pathname.endsWith('visits')
                  ? 'border-b-2 border-blue-600 text-primary'
                  : 'hover:text-foreground transition-all duration-75',
                'py-2 flex justify-center',
              )}
              href={{
                pathname: '/city/ranking/visits',
                query: searchParams.toString(),
              }}
            >
              {t('ranking.city.visits')}
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:flex sm:[&>*]:w-[180px] gap-2">
            <SelectCountry
              defaultIso2={countryIso2?.toUpperCase()}
              onSelect={handleChangeCountry}
            />
            <div>
              <Select
                defaultValue={date ? date : '0'}
                onValueChange={handleChangeDatePreset}
              >
                <SelectTrigger>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-[16px]" />
                    <SelectValue
                      placeholder={t(`ranking.date-range.date`, {
                        count: date ? date : '0',
                      })}
                    />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {['7', '30', '90', '365', '0', ...(date ? [date] : [])]
                    .filter((value, index, array) => array.indexOf(value) === index)
                    .map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {t(`ranking.date-range.date`, {
                          count: num,
                        })}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}
