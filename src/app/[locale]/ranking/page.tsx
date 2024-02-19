'use client';

import { CountryFlag } from '@/components/ui/country-flag';
import axios from '@/services/axios';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import React from 'react';

export default function Page() {
  const countryInterest = useQuery<Ranking>({
    queryFn: async () => {
      const mostInterestedCountries = (
        await axios<CountryInterestRanking>('/countries/ranking/interest?page=1&count=10')
      ).data;

      const mostInterestedCities = (
        await axios<CityInterestRanking>('/cities/ranking/interest?page=1&count=10')
      ).data;

      return {
        mostInterestedCities,
        mostInterestedCountries,
      };
    },
    queryKey: ['ranking'],
  });

  if (!countryInterest.data) {
    return;
  }

  return (
    <div className="px-4 md:px-11 pt-4">
      <div className="grid w-full grid-cols-2 gap-4">
        <div>
          <div className="mb-2">
            <h2 className="font-bold text-xl">Países com maior interesse</h2>
          </div>
          <div>
            <ul>
              {countryInterest.data.mostInterestedCountries.map((country) => (
                <div
                  key={country.iso2}
                  className="flex items-center h-[44px] p-4 justify-between"
                >
                  <div className="flex gap-3 items-center">
                    <CountryFlag className="w-[36px]" iso2={country.iso2} />
                    <Link href={'/country/' + country.iso2}>{country.name}</Link>
                  </div>
                  <div>
                    <span>{country.totalInterest}</span>
                  </div>
                </div>
              ))}
            </ul>
          </div>
        </div>
        <div>
          <div className="mb-2">
            <h2 className="font-bold text-xl">Cidades com maior interesse</h2>
          </div>
          <ul>
            {countryInterest.data.mostInterestedCities.map((city, index) => (
              <div key={index} className="flex items-center h-[44px] p-4 justify-between">
                <div className="flex gap-3 items-center">
                  <CountryFlag className="w-[36px]" iso2={city.countryIso2} />
                  <Link href={'/city/' + city.id}>{city.name}</Link>
                </div>
                <div>
                  <span>{city.totalInterest}</span>
                </div>
              </div>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
