'use client';

import React from 'react';
import { DiaryPost } from '@/components/diary-post';
import { useOriginTracker } from '@/context/origin-tracker';
import axios from '@/services/axios';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useFormatter, useTranslations } from 'next-intl';
import { Separator } from '@/components/ui/separator';

export default function Page({ params }: { params: { slug: string; id: string } }) {
  const isWithinPage = useOriginTracker();
  const router = useRouter();
  const formatter = useFormatter();
  const t = useTranslations();

  const tripDiary = useQuery<TripDiary>(
    ['tripDiary', params.id],
    async () => (await axios.get<TripDiary>('tripDiaries/' + params.id)).data,
  );

  const tripDiaryPosts = useQuery<DiaryPost[]>(
    ['tripDiaryPosts', +params.id],
    async () => (await axios.get<DiaryPost[]>(`tripDiaries/${params.id}/posts`)).data,
  );

  if (tripDiary.isError) {
    return (
      <div className="mt-4 flex w-full justify-center">
        <span>{t('diary.notFound')}</span>
      </div>
    );
  }

  return (
    <div>
      <div className="flex pt-4 md:px-11 items-start">
        <div
          onClick={() => (isWithinPage ? router.back() : router.push('/'))}
          className="flex mr-6 items-center justify-center rounded-full w-8 h-8 cursor-pointer"
        >
          <ArrowLeft strokeWidth={3} size={20} />
        </div>
        {tripDiary.data && (
          <div className="flex flex-col w-full">
            <div className="flex justify-between items-center w-full">
              <span className="font-bold">{tripDiary.data.title}</span>
              <span className="text-muted-foreground text-sm">
                {formatter.relativeTime(tripDiary.data.createdAt, new Date())}
              </span>
            </div>
            <span className="text-muted-foreground">{tripDiary.data.message}</span>
            {tripDiary.data && (
              <span className="text-muted-foreground text-sm">
                {t('diary.posts', { count: tripDiaryPosts.data?.length })}
              </span>
            )}
          </div>
        )}
      </div>
      <Separator className="mt-4" />
      {tripDiaryPosts.data &&
        tripDiaryPosts.data.map((post) => <DiaryPost key={post.id} post={post} />)}
    </div>
  );
}
