'use client';

import React from 'react';
import { DiaryPost } from '@/components/diary-post';
import axios from '@/services/axios';
import { useQuery } from '@tanstack/react-query';

export default function Default({ params }: { params: { slug: string } }) {
  const diaryPosts = useQuery<DiaryPost[]>(
    ['diaryPosts', params.slug],
    async () => (await axios.get<DiaryPost[]>('/diaryPosts/user/' + params.slug)).data,
  );

  return (
    diaryPosts.data &&
    diaryPosts.data.length > 0 &&
    diaryPosts.data.map((post) => <DiaryPost key={post.id} post={post} />)
  );
}
