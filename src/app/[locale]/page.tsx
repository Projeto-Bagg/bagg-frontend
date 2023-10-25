'use client';

import { DiaryPost } from '@/components/diary-post';
import axios from '@/services/axios';
import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import React from 'react';

export default function Page() {
  const t = useTranslations();

  const feed = useQuery<DiaryPost[]>(
    ['feed'],
    async () => (await axios.get<DiaryPost[]>('diaryPosts/feed')).data,
  );

  return (
    <div className="container min-h-">
      <div className="px-[52px] pt-4">
        <h1 className="text-lg font-bold">{t('homepage.title')}</h1>
      </div>
      {feed.data && feed.data.map((post) => <DiaryPost post={post} key={post.id} />)}
    </div>
  );
}
