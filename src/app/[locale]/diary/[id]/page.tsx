'use client';

import { DiaryPost } from '@/components/diary-post';
import axios from '@/services/axios';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

export default function Page({ params }: { params: { slug: string; id: string } }) {
  const diaryPost = useQuery<DiaryPost>(
    ['diaryPost', params.id],
    async () => (await axios.get<DiaryPost>('/diaryPosts/' + params.id)).data,
  );

  return (
    <div>
      <div className="flex pt-4 md:px-11 items-center">
        <Link href={'/'}>
          <ArrowLeft size={20} className="mr-9" />
        </Link>
        <h3 className="font-bold">Diary</h3>
      </div>
      {diaryPost.data && <DiaryPost post={diaryPost.data} />}
    </div>
  );
}
