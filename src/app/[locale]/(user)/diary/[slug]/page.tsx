'use client';

import React from 'react';
import { useOriginTracker } from '@/context/origin-tracker';
import axios from '@/services/axios';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { TripDiary } from '@/components/posts/trip-diary';
import { Feed } from '@/components/feed';

export default function Page({ params }: { params: { slug: string } }) {
  const isWithinPage = useOriginTracker();
  const router = useRouter();
  const t = useTranslations();

  const tripDiary = useQuery<TripDiary>({
    queryKey: ['trip-diary', +params.slug],
    queryFn: async () => (await axios.get<TripDiary>('trip-diaries/' + params.slug)).data,
  });

  const posts = useInfiniteQuery<DiaryPost[]>({
    queryKey: ['trip-diary-posts', +params.slug],
    queryFn: async ({ pageParam }) =>
      (
        await axios.get<DiaryPost[]>(`trip-diaries/${params.slug}/posts`, {
          params: {
            page: pageParam,
          },
        })
      ).data,
    initialPageParam: 1,
    getNextPageParam: (page, allPages) =>
      page.length === 10 ? allPages.length + 1 : null,
  });

  if (tripDiary.isError) {
    return (
      <div className="mt-4 flex w-full container justify-center">
        <span>{t('trip-diary.not-found')}</span>
      </div>
    );
  }

  return (
    <div className="p-4 container">
      <div className="flex items-center">
        <div
          onClick={() => (isWithinPage ? router.back() : router.push('/'))}
          className="flex mr-6 items-center justify-center rounded-full w-8 cursor-pointer"
        >
          <ArrowLeft strokeWidth={3} size={20} />
        </div>
        <h3 className="font-bold text-lg">{t('trip-diary.trip-diary')}</h3>
      </div>
      {tripDiary.data && <TripDiary tripDiary={tripDiary.data} />}
      {posts && <Feed feed={posts} />}
    </div>
  );
}
