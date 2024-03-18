'use client';

import { Link, usePathname, useRouter } from '@/common/navigation';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { Calendar } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import React, { ReactNode } from 'react';
import queryString from 'query-string';

export default function Layout({ children }: { children: ReactNode }) {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const date = searchParams.get('date');

  const handleChangeDatePreset = (value: string) => {
    router.push({
      pathname: pathname,
      params: {
        slug: '',
      },
      ...(+value && {
        query: {
          date: +value,
        },
      }),
    });
  };

  return (
    <div className="p-4">
      <div className="mb-2">
        <h1 className="font-bold w-fit text-2xl border-b-2 border-primary pb-1">
          {t('ranking.country.title')}
        </h1>
        <div className="flex pb-2 flex-col sm:flex-row justify-between gap-2 sm:items-end">
          <div className="flex">
            <Link
              className={cn(
                pathname.endsWith('rating') && 'font-bold border-b-2 border-blue-600',
                'py-2 flex justify-center w-[110px]',
              )}
              href={{
                pathname: '/country/ranking/rating',
                query: queryString.parse(searchParams.toString()) as Record<
                  string,
                  string
                >,
              }}
            >
              {t('ranking.country.rating')}
            </Link>
            <Link
              className={cn(
                pathname.endsWith('visits') && 'font-bold border-b-2 border-blue-600',
                'py-2 flex justify-center w-[110px]',
              )}
              href={{
                pathname: '/country/ranking/visits',
                query: queryString.parse(searchParams.toString()) as Record<
                  string,
                  string
                >,
              }}
            >
              {t('ranking.country.visits')}
            </Link>
          </div>
          <div>
            <Label>{t('ranking.date-range.label')}</Label>
            <Select
              defaultValue={date ? date : '0'}
              onValueChange={handleChangeDatePreset}
            >
              <SelectTrigger className="w-[180px]">
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
                    <SelectItem key={num} value={num}>
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
      {children}
    </div>
  );
}
