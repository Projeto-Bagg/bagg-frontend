'use client';

import React, { useEffect } from 'react';
import { DiaryPost } from '@/components/diary-post';
import { useOriginTracker } from '@/context/origin-tracker';
import axios from '@/services/axios';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Separator } from '@/components/ui/separator';
import { useInView } from 'react-intersection-observer';
import TripDiary from '@/components/trip-diary';

export default function Page({ params }: { params: { slug: string } }) {
  const isWithinPage = useOriginTracker();
  const router = useRouter();
  const t = useTranslations();
  const { ref, inView } = useInView();

  const tripDiary = useQuery<TripDiary>({
    queryKey: ['trip-diary', +params.slug],
    queryFn: async () => (await axios.get<TripDiary>('trip-diaries/' + params.slug)).data,
  });

  const {
    data: tripDiaryPosts,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery<DiaryPost[]>({
    queryKey: ['trip-diary-posts', +params.slug],
    queryFn: async ({ pageParam }) =>
      (await axios.get<DiaryPost[]>(`trip-diaries/${params.slug}/posts?page${pageParam}`))
        .data,
    initialPageParam: 1,
    getNextPageParam: (page, allPages) =>
      page.length === 10 ? allPages.length + 1 : null,
  });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage]);

  if (tripDiary.isError) {
    return (
      <div className="mt-4 flex w-full justify-center">
        <span>{t('trip-diary.not-found')}</span>
      </div>
    );
  }

  return (
    <div>
      <div className="flex p-4 items-center">
        <div
          onClick={() => (isWithinPage ? router.back() : router.push('/'))}
          className="flex mr-6 items-center justify-center rounded-full w-8 cursor-pointer"
        >
          <ArrowLeft strokeWidth={3} size={20} />
        </div>
        <h3 className="font-bold text-lg">{t('trip-diary.trip-diary')}</h3>
      </div>
      {tripDiary.data && <TripDiary tripDiary={tripDiary.data} />}
      {tripDiaryPosts &&
        tripDiaryPosts.pages.map((page) =>
          page.map((post, index) => (
            <DiaryPost
              ref={page.length - 1 === index ? ref : undefined}
              key={post.id}
              post={post}
            />
          )),
        )}
    </div>
  );
}
