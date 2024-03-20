'use client';

import { Link } from '@/common/navigation';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import axios from '@/services/axios';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

export default function Residents({ params }: { params: { slug: string } }) {
  const { ref, inView } = useInView();
  const t = useTranslations();

  const { data, fetchNextPage, hasNextPage } = useInfiniteQuery<User[]>({
    queryKey: ['city', +params.slug, 'residents'],
    queryFn: async ({ pageParam }) =>
      (
        await axios.get<User[]>(`/cities/${params.slug}/residents`, {
          params: {
            page: pageParam,
            count: 15,
          },
        })
      ).data,
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
    <div>
      <div className="mb-2 pb-1 border-b-2 border-primary">
        <h3 className="font-bold text-xl">
          {t('country-city-page.tabs.residents.label')}
        </h3>
      </div>
      <div>
        {data?.pages[0].length === 0 && (
          <div className="py-4 text-sm text-center">
            <span>{t('country-city-page.tabs.residents.no-residents')}</span>
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2">
          {data?.pages.map((page, index) =>
            page.map((user) => (
              <div
                key={user.id}
                ref={page.length - 1 === index ? ref : undefined}
                className="p-3 flex gap-2"
              >
                <Link href={{ params: { slug: user.username }, pathname: '/[slug]' }}>
                  <Avatar className="w-[64px] h-[64px]">
                    <AvatarImage src={user.image} />
                  </Avatar>
                </Link>
                <div className="flex flex-col justify-center">
                  <div>
                    <Link
                      className="hover:underline"
                      href={{ params: { slug: user.username }, pathname: '/[slug]' }}
                    >
                      {user.fullName}
                    </Link>{' '}
                    <Link
                      className="text-muted-foreground hover:underline"
                      href={{ params: { slug: user.username }, pathname: '/[slug]' }}
                    >
                      @{user.username}
                    </Link>
                  </div>
                  <span className="text-sm">{user.bio}</span>
                </div>
              </div>
            )),
          )}
        </div>
      </div>
    </div>
  );
}
