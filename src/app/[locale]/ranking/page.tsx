'use client';

import { CountryFlag } from '@/components/ui/country-flag';
import axios from '@/services/axios';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import React from 'react';

export default function Page() {
  const ranking = useQuery<Ranking>({
    queryFn: async () => {
      const countryInterestRanking = (
        await axios<CountryInterestRanking>('/countries/ranking/interest?page=1&count=10')
      ).data;

      const countryVisitRanking = (
        await axios<CountryVisitRanking>('/countries/ranking/visit?page=1&count=10')
      ).data;

      const cityInterestRanking = (
        await axios<CityInterestRanking>('/cities/ranking/interest?page=1&count=10')
      ).data;

      const cityVisitRanking = (
        await axios<CityVisitRanking>('/cities/ranking/visit?page=1&count=10')
      ).data;

      return {
        countryInterestRanking,
        countryVisitRanking,
        cityInterestRanking,
        cityVisitRanking,
      };
    },
    queryKey: ['ranking'],
  });

  if (!ranking.data) {
    return;
  }

  return (
    <div className="px-4 md:px-11 py-4">
      <div className="mb-2">
        <h1 className="text-4xl font-bold">Ranking</h1>
      </div>
      <div className="grid w-full grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="mb-2">
            <h2 className="font-bold text-xl border-b-2 border-primary pb-1">
              Países com maior interesse
            </h2>
          </div>
          <div>
            <ul className="divide-y-2">
              {ranking.data.countryInterestRanking.map((country) => (
                <Link
                  href={'/country/' + country.iso2}
                  key={country.iso2}
                  className="flex items-center h-[44px] p-4 justify-between"
                >
                  <div className="flex gap-3 items-center">
                    <CountryFlag className="w-[36px] rounded-sm" iso2={country.iso2} />
                    <span>{country.name}</span>
                  </div>
                  <div>
                    <span>{country.totalInterest}</span>
                  </div>
                </Link>
              ))}
            </ul>
          </div>
        </div>
        <div>
          <div className="mb-2">
            <h2 className="font-bold text-xl border-b-2 border-primary pb-1">
              Cidades com maior interesse
            </h2>
          </div>
          <ul className="divide-y-2">
            {ranking.data.cityInterestRanking.map((city, index) => (
              <Link
                href={'/city/' + city.id}
                key={index}
                className="flex items-center h-[44px] p-4 justify-between"
              >
                <div className="flex gap-3 items-center">
                  <Link href={'/country/' + city.region.country.iso2}>
                    <CountryFlag
                      className="w-[36px] rounded-sm"
                      iso2={city.region.country.iso2}
                      tooltip={city.region.country.name}
                    />
                  </Link>
                  <div className="flex gap-2">
                    <span>{city.name}</span>
                    <span className="text-muted-foreground">{city.region.name}</span>
                  </div>
                </div>
                <div>
                  <span>{city.totalInterest}</span>
                </div>
              </Link>
            ))}
          </ul>
        </div>
        <div>
          <div className="mb-2">
            <h2 className="font-bold text-xl border-b-2 border-primary pb-1">
              Países mais visitados
            </h2>
          </div>
          <div>
            <ul className="divide-y-2">
              {ranking.data.countryVisitRanking.map((country) => (
                <Link
                  href={'/country/' + country.iso2}
                  key={country.iso2}
                  className="flex items-center h-[44px] p-4 justify-between"
                >
                  <div className="flex gap-3 items-center">
                    <CountryFlag className="w-[36px] rounded-sm" iso2={country.iso2} />
                    <span>{country.name}</span>
                  </div>
                  <div>
                    <span>{country.totalVisit}</span>
                  </div>
                </Link>
              ))}
            </ul>
          </div>
        </div>
        <div>
          <div className="mb-2">
            <h2 className="font-bold text-xl border-b-2 border-primary pb-1">
              Cidades mais visitadas
            </h2>
          </div>
          <ul className="divide-y-2">
            {ranking.data.cityVisitRanking.map((city, index) => (
              <Link
                href={'/city/' + city.id}
                key={index}
                className="flex items-center h-[44px] p-4 justify-between"
              >
                <div className="flex gap-3 items-center">
                  <Link href={'/country/' + city.region.country.iso2}>
                    <CountryFlag
                      className="w-[36px] rounded-sm"
                      iso2={city.region.country.iso2}
                      tooltip={city.region.country.name}
                    />
                  </Link>
                  <div className="flex gap-2">
                    <span>{city.name}</span>
                    <span className="text-muted-foreground">{city.region.name}</span>
                  </div>
                </div>
                <div>
                  <span>{city.totalVisit}</span>
                </div>
              </Link>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
