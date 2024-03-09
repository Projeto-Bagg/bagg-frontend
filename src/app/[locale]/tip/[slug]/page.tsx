'use client';

import React from 'react';
import { useOriginTracker } from '@/context/origin-tracker';
import axios from '@/services/axios';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Tip } from '@/components/tip';

export default function Page({ params }: { params: { slug: string } }) {
  const isWithinPage = useOriginTracker();
  const router = useRouter();

  const tip = useQuery<Tip>({
    queryKey: ['tip', params.slug],
    queryFn: async () => (await axios.get<Tip>('/tips/' + params.slug)).data,
  });

  return (
    <div>
      <div className="flex pt-4 md:px-11 items-center">
        <div
          onClick={() => (isWithinPage ? router.back() : router.push('/'))}
          className="flex mr-6 items-center justify-center rounded-full w-8 h-8 cursor-pointer"
        >
          <ArrowLeft strokeWidth={3} size={20} />
        </div>
        <h3 className="font-bold">Tip</h3>
      </div>
      {tip.data && <Tip tip={tip.data} />}
    </div>
  );
}
