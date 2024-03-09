'use client';

import { DiaryPost } from '@/components/diary-post';
import { Tip } from '@/components/tip';
import axios from '@/services/axios';
import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import React from 'react';

export default function Page() {
  const t = useTranslations();

  const feed = useQuery<Tip[]>({
    queryKey: ['feed'],
    queryFn: async () => (await axios.get<Tip[]>('/tips/feed')).data,
  });

  return (
    <div className="container">
      <div className="px-4 md:px-11 pt-4">
        <h1 className="text-lg font-bold">{t('homepage.title')}</h1>
      </div>
      {feed.data && feed.data.map((tip) => <Tip tip={tip} key={tip.id} />)}
    </div>
  );
}
