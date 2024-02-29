'use client';

import axios from '@/services/axios';
import { useQuery } from '@tanstack/react-query';
import { useFormatter } from 'next-intl';
import { Link } from '@/common/navigation';
import React from 'react';
import { CountryFlag } from '@/components/ui/country-flag';

export default function Page({ params }: { params: { slug: string } }) {
  const formatter = useFormatter();

  const tripDiaries = useQuery<TripDiary[]>({
    queryKey: ['tripDiaries', params.slug],
    queryFn: async () =>
      (await axios.get<TripDiary[]>('/tripDiaries/user/' + params.slug)).data,
  });

  return (
    <div>
      {tripDiaries.data &&
        tripDiaries.data.map((diary) => (
          <Link
            href={{ params: { slug: diary.id }, pathname: '/diary/[slug]' }}
            key={diary.id}
            className="block min-h-[100px] sm:m-4 p-4 sm:px-7 hover:no-underline space-y-3 border-b sm:border sm:border-border sm:rounded-lg"
          >
            <div className="flex flex-col w-full">
              <div className="flex justify-between items-center w-full">
                <div>
                  <span className="font-bold">{diary.title}</span>
                  <div className="flex gap-1 text-sm text-muted-foreground">
                    <span>
                      {diary.city.name}, {diary.city.region.name},{' '}
                      {diary.city.region.country.name}
                    </span>
                    <CountryFlag className="ml-1" iso2={diary.city.region.country.iso2} />
                  </div>
                </div>
                <span className="text-muted-foreground text-sm">
                  {formatter.relativeTime(diary.createdAt, new Date())}
                </span>
              </div>
              <span className="text-muted-foreground text-sm pt-1">{diary.message}</span>
            </div>
          </Link>
        ))}
    </div>
  );
}
