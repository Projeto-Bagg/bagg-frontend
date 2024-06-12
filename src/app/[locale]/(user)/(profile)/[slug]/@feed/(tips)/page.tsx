'use client';

import React from 'react';
import axios from '@/services/axios';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Feed } from '@/components/feed';

export default function Default({ params }: { params: { slug: string } }) {
  const tips = useInfiniteQuery<Tip[]>({
    queryKey: ['tips', params.slug],
    queryFn: async ({ pageParam }) =>
      (
        await axios.get<Tip[]>(`/tips/user/${params.slug}`, {
          params: {
            page: pageParam,
          },
        })
      ).data,
    initialPageParam: 1,
    getNextPageParam: (page, allPages) =>
      page.length === 10 ? allPages.length + 1 : null,
  });

  return <Feed feed={tips} />;
}
