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
import { Separator } from '@/components/ui/separator';

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
      <div className="mb-4">
        <h1 className="font-bold w-fit text-xl sm:text-2xl border-b-2 border-primary pb-1">
          {t('ranking.country.title')}
        </h1>
        <div className="flex text-sm sm:text-base flex-col sm:flex-row justify-between sm:items-end">
          <div className="flex mt-2">
            <Link
              className={cn(
                pathname.endsWith('rating') && 'font-bold border-b-2 border-blue-600',
                'py-2 flex justify-center w-[96px] sm:w-[110px]',
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
                'py-2 flex justify-center w-[96px] sm:w-[110px]',
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
          <Separator className="sm:hidden my-3" />
          <div className="grid grid-cols-2 sm:flex sm:[&>*]:w-[180px] gap-2">
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
