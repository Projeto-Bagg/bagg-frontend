'use client';

import { useRouter } from '@/common/navigation';
import { Feed } from '@/components/feed';
import { SelectCity } from '@/components/select-city';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import axios from '@/services/axios';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import React, { useState } from 'react';

export default function Page() {
  const router = useRouter();
  const t = useTranslations();
  const searchParams = useSearchParams();
  const q = searchParams.get('q');
  const tags = searchParams.get('tags');
  const tagsArray = tags?.split(';') || [];
  const city = searchParams.get('city');
  const [defaultCity] = useState<string | null>(city);

  const defaultCityData = useQuery<CityPage>({
    queryFn: async () => (await axios.get<CityPage>('/cities/' + defaultCity)).data,
    queryKey: ['city', defaultCity],
    enabled: !!defaultCity,
  });

  const tips = useInfiniteQuery<Tip[]>({
    queryKey: ['tip-search', q, tagsArray.join(';'), city],
    queryFn: async ({ pageParam }) =>
      (
        await axios.get<Tip[]>(`/tips/search`, {
          params: {
            page: pageParam,
            count: 10,
            ...(q && {
              q,
            }),
            ...(tagsArray.length !== 0 && {
              tags: tagsArray.join(';'),
            }),
            ...(city && {
              city,
            }),
          },
        })
      ).data,
    initialPageParam: 1,
    getNextPageParam: (page, allPages) => {
      if (page.length === 10) {
        return allPages.length + 1;
      }

      return null;
    },
    enabled: !!q || tagsArray.length !== 0 || !!city,
  });

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 items-end gap-x-4 gap-y-1">
        <div>
          <div>
            <div className="flex items-baseline justify-between mb-0.5">
              <Label className="mr-1">{t('create-tip.tags.label')}</Label>
              <Label className="hidden md:block text-muted-foreground text-xs">
                {t('create-tip.tags.helper')}
              </Label>
            </div>
            <Input
              name="tags"
              placeholder={t('create-tip.tags.placeholder')}
              onKeyDown={(e) => {
                if (e.key === 'Tab' || e.key === 'Enter') {
                  const tag = e.currentTarget.value.trim();

                  if (tag && !tagsArray.find((currentTag) => tag === currentTag)) {
                    tagsArray.push(tag);

                    router.replace({
                      pathname: '/search',
                      query: {
                        ...(q && {
                          q,
                        }),
                        tags: tagsArray.join(';'),
                        ...(city && {
                          city,
                        }),
                      },
                    });
                    e.currentTarget.value = '';
                  }

                  e.preventDefault();
                }
              }}
            />
          </div>
        </div>
        <div className="order-3 sm:order-2">
          <Label>{t('select-city.label')}</Label>
          <SelectCity
            defaultValue={defaultCityData.data}
            onSelect={(city) => {
              router.replace({
                pathname: '/search',
                query: {
                  ...(q && {
                    q,
                  }),
                  ...(tagsArray.length !== 0 && {
                    tags: tagsArray.join(';'),
                  }),
                  ...(city && {
                    city,
                  }),
                },
              });
            }}
          />
        </div>
        <div data-test="current-tags" className="flex order-2 sm:order-3 flex-wrap gap-1">
          {tagsArray.map((tag) => (
            <div
              className="px-1 flex items-center gap-1 h-fit rounded-sm bg-accent"
              data-test={'tag-' + tag}
              key={tag}
            >
              <span className="text-xs max-w-[86px] text-ellipsis overflow-hidden whitespace-nowrap">
                {tag}
              </span>
              <button
                type="button"
                data-test={'remove-tag-' + tag}
                onClick={() => {
                  const newTags = tagsArray.filter((currentTag) => currentTag !== tag);

                  router.replace({
                    pathname: '/search',
                    query: {
                      ...(q && {
                        q,
                      }),
                      ...(newTags.length !== 0 && {
                        tags: newTags.join(';'),
                      }),
                      ...(city && {
                        city,
                      }),
                    },
                  });
                }}
              >
                <X className="w-[12px]" />
              </button>
            </div>
          ))}
        </div>
      </div>
      <Separator className="my-2" />
      {tips && (
        <Feed
          feed={tips}
          emptyFeedComponent={
            <span data-test="no-results" className="flex mt-4 justify-center font-bold">
              {t('search-page.options.tip.no-results')}
            </span>
          }
        />
      )}
    </div>
  );
}
