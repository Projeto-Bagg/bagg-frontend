'use client';

import { CountryFlag } from '@/components/ui/country-flag';
import axios from '@/services/axios';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

export default function Page({ params }: { params: { slug: string; id: string } }) {
  const country = useQuery<Country>({
    queryFn: async () => (await axios.get<Country>('/countries/' + params.slug)).data,
    queryKey: ['country', params.slug],
  });

  if (!country.data) {
    return;
  }

  return (
    <div>
      <div className="flex items-center flex-col">
        <CountryFlag iso2={country.data.iso2} className="h-full w-[70%]" />
        <div>{country.data.name}</div>
      </div>
    </div>
  );
}
