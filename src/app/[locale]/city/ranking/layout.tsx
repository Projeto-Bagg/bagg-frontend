'use client';

import { Link, usePathname, useRouter } from '@/common/navigation';
import { SelectCountry } from '@/components/select-country';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
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

  const handleChangeCountry = (value: Country) => {
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
        <h1 className="font-bold w-fit text-xl sm:text-2xl border-b-2 border-primary pb-1">
          {t('ranking.city.title')}
        </h1>
        <div className="flex mt-2 text-sm sm:text-base flex-col sm:flex-row justify-between sm:items-end">
          <div className="flex">
            <Link
              className={cn(
                pathname.endsWith('rating') && 'font-bold border-b-2 border-blue-600',
                'py-2 flex justify-center w-[96px] sm:w-[110px]',
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
                pathname.endsWith('visits') && 'font-bold border-b-2 border-blue-600',
                'py-2 flex justify-center w-[96px] smw-[110px]',
              )}
              href={{
                pathname: '/city/ranking/visits',
                query: searchParams.toString(),
              }}
            >
              {t('ranking.city.visits')}
            </Link>
          </div>
          <Separator className="sm:hidden my-3" />
          <div className="grid grid-cols-2 sm:flex sm:[&>*]:w-[180px] gap-2">
            {/* {searchParams.has('countryIso2') && (
                <Link
                  href={{
                    pathname: pathname,
                    params: { slug: '' },
                    query: {
                      ...(date && {
                        date: date,
                      }),
                    },
                  }}
                >
                  <X className="w-[16px] absolute right-1 -top- text-red-600 stroke-[3.5]" />
                </Link>
              )} */}
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
