'use client';

import axios from '@/services/axios';
import { useQuery } from '@tanstack/react-query';
import { useFormatter } from 'next-intl';
import Link from 'next/link';
import React from 'react';

export default function Page({ params }: { params: { slug: string } }) {
  const formatter = useFormatter();

  const tripDiaries = useQuery<TripDiary[]>(
    ['tripDiaries', params.slug],
    async () => (await axios.get<TripDiary[]>('/tripDiaries/user/' + params.slug)).data,
  );

  return (
    <div>
      {tripDiaries.data &&
        tripDiaries.data.map((diary) => (
          <Link
            href={'/diary/' + diary.id}
            key={diary.id}
            className="block md:m-4 p-4 md:px-7 space-y-3 border-b md:border md:border-border md:rounded-lg"
          >
            <div className="flex flex-col w-full">
              <div className="flex justify-between items-center w-full">
                <span className="font-bold">{diary.title}</span>
                <span className="text-muted-foreground text-sm">
                  {formatter.relativeTime(diary.createdAt, new Date())}
                </span>
              </div>
              <span className="text-muted-foreground text-sm">{diary.message}</span>
            </div>
          </Link>
        ))}
    </div>
  );
}
