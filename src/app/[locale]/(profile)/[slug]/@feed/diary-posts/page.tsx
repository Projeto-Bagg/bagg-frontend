'use client';

import React from 'react';
import axios from '@/services/axios';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Feed } from '@/components/feed';

export default function DiaryPosts({ params }: { params: { slug: string } }) {
  const diaryPosts = useInfiniteQuery<DiaryPost[]>({
    queryKey: ['diary-posts', params.slug],
    queryFn: async ({ pageParam }) =>
      (
        await axios.get<DiaryPost[]>(`/diary-posts/user/${params.slug}`, {
          params: {
            page: pageParam,
          },
        })
      ).data,
    initialPageParam: 1,
    getNextPageParam: (page, allPages) =>
      page.length === 10 ? allPages.length + 1 : null,
  });

  return (
    <div data-test="diary-posts-feed">
      <Feed feed={diaryPosts} />
    </div>
  );
}
