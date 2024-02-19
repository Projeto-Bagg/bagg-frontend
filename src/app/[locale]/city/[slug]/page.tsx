'use client';

import { useCreateCityInterest } from '@/hooks/useCreateCityInterest';
import axios from '@/services/axios';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { useDeleteCityInterest } from '@/hooks/useDeleteCityInterest';
import { CountryFlag } from '@/components/ui/country-flag';

export default function Page({ params }: { params: { slug: string; id: string } }) {
  const createCityInterest = useCreateCityInterest();
  const deleteCityInterest = useDeleteCityInterest();

  const city = useQuery<City>({
    queryFn: async () => (await axios.get<City>('/cities/' + params.slug)).data,
    queryKey: ['city', +params.slug],
  });

  if (!city.data) {
    return;
  }

  const checkInterest = () => {
    if (city.data.isInterested) {
      return deleteCityInterest.mutateAsync(city.data.id);
    }

    createCityInterest.mutateAsync(city.data.id);
  };

  return (
    <div className="px-4 md:px-11 pt-4">
      <div className="flex relative">
        <CountryFlag
          className="w-[80%] left-0 right-0 m-auto absolute -z-10"
          iso2={city.data.region.country.iso2}
        />
        <h2 className="font-bold text-xl">{city.data.name}</h2>
        <h2 className="font-semibold text-lg">{city.data.region.country.name}</h2>
        <div>
          <button onClick={checkInterest}>
            {city.data.isInterested ? <XCircle /> : <CheckCircle />}
          </button>
        </div>
      </div>
    </div>
  );
}
