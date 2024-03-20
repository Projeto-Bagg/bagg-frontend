'use client';

import React, { useEffect } from 'react';
import axios from '@/services/axios';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Tip } from '@/components/tip';
import { useInView } from 'react-intersection-observer';

export default function Default({ params }: { params: { slug: string } }) {
  const { ref, inView } = useInView();

  const { data, fetchNextPage, hasNextPage } = useInfiniteQuery<Tip[]>({
    queryKey: ['tips', params.slug],
    queryFn: async ({ pageParam }) =>
      (await axios.get<Tip[]>(`/tips/user/${params.slug}?page=${pageParam}`)).data,
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
    data.pages.length > 0 &&
    data.pages.map((page) =>
      page.map((tip, index) => (
        <Tip ref={page.length - 1 === index ? ref : undefined} key={tip.id} tip={tip} />
      )),
    )
  );
}
