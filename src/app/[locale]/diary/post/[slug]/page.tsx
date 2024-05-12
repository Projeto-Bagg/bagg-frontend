'use client';

import React from 'react';
import { DiaryPost } from '@/components/posts/diary-post';
import { useOriginTracker } from '@/context/origin-tracker';
import axios from '@/services/axios';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Page({ params }: { params: { slug: string } }) {
  const isWithinPage = useOriginTracker();
  const router = useRouter();

  const diaryPost = useQuery<DiaryPost>({
    queryKey: ['diary-post', +params.slug],
    queryFn: async () =>
      (await axios.get<DiaryPost>('/diary-posts/' + +params.slug)).data,
  });

  return (
    <div className="p-4 container">
      <div className="flex items-center">
        <div
          onClick={() => (isWithinPage ? router.back() : router.push('/'))}
          className="flex mr-6 items-center justify-center rounded-full w-8 h-8 cursor-pointer"
        >
          <ArrowLeft strokeWidth={3} size={20} />
        </div>
        <h3 className="font-bold">Diary</h3>
      </div>
      {diaryPost.data && <DiaryPost post={diaryPost.data} />}
    </div>
  );
}
