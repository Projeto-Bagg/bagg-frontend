'use client';

import { DiaryPost } from '@/components/diary-post';
import axios from '@/services/axios';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

export default function LikesFeed({ params }: { params: { slug: string } }) {
  const diaryPosts = useQuery<DiaryPost[]>(
    ['diaryPosts', 'like', params.slug],
    async () =>
      (await axios.get<DiaryPost[]>(`/diaryPosts/user/${params.slug}/feed/like`)).data,
  );

  return (
    diaryPosts.data &&
    diaryPosts.data.length > 0 &&
    diaryPosts.data.map((post) => <DiaryPost key={post.id} post={post} />)
  );
}
