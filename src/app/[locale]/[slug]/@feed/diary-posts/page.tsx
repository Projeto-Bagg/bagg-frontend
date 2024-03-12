'use client';

import React, { useEffect } from 'react';
import { DiaryPost } from '@/components/diary-post';
import axios from '@/services/axios';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';

export default function DiaryPosts({ params }: { params: { slug: string } }) {
  const { ref, inView } = useInView();

  const { data, fetchNextPage, hasNextPage } = useInfiniteQuery<DiaryPost[]>({
    queryKey: ['diary-posts', params.slug],
    queryFn: async ({ pageParam }) =>
      (await axios.get<DiaryPost[]>(`/diary-posts/user/${params.slug}?page=${pageParam}`))
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

  return (
    data &&
    data.pages.map((page) =>
      page.map((post, index) => (
        <DiaryPost
          ref={page.length - 1 === index ? ref : undefined}
          key={post.id}
          post={post}
        />
      )),
    )
  );
}
