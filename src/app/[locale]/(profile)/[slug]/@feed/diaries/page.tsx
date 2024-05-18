'use client';

import axios from '@/services/axios';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { TripDiary } from '@/components/posts/trip-diary';

export default function Page({ params }: { params: { slug: string } }) {
  const tripDiaries = useQuery<TripDiary[]>({
    queryKey: ['trip-diaries', params.slug],
    queryFn: async () =>
      (await axios.get<TripDiary[]>('/trip-diaries/user/' + params.slug)).data,
  });

  return (
    <div>
      {tripDiaries.data &&
        tripDiaries.data.map((tripDiary) => (
          <TripDiary key={tripDiary.id} tripDiary={tripDiary} seePostsAnchor />
        ))}
    </div>
  );
}
