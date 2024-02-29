'use client';

import React from 'react';
import { CountryFlag } from '@/components/ui/country-flag';
import axios from '@/services/axios';
import { useQuery } from '@tanstack/react-query';
import { Link } from '@/common/navigation';
import { Rating } from '@smastrom/react-rating';

export default function Page() {
  const ranking = useQuery<Ranking>({
    queryFn: async () => {
      const [
        countryInterestRanking,
        countryVisitRanking,
        countryRatingRanking,
        cityInterestRanking,
        cityVisitRanking,
        cityRatingRanking,
      ] = await Promise.all([
        axios<CountryInterestRanking>('/countries/ranking/interest?page=1&count=10').then(
          (response) => response.data,
        ),
        axios<CountryVisitRanking>('/countries/ranking/visit?page=1&count=10').then(
          (response) => response.data,
        ),
        axios<CountryRatingRanking>('/countries/ranking/rating?page=1&count=10').then(
          (response) => response.data,
        ),
        axios<CityInterestRanking>('/cities/ranking/interest?page=1&count=10').then(
          (response) => response.data,
        ),
        axios<CityVisitRanking>('/cities/ranking/visit?page=1&count=10').then(
          (response) => response.data,
        ),
        axios<CityRatingRanking>('/cities/ranking/rating?page=1&count=10').then(
          (response) => response.data,
        ),
      ]);

      return {
        countryInterestRanking,
        countryVisitRanking,
        countryRatingRanking,
        cityInterestRanking,
        cityVisitRanking,
        cityRatingRanking,
      };
    },
    queryKey: ['ranking'],
  });

  if (!ranking.data) {
    return;
  }

  return (
    <div className="px-4 sm:px-11 py-4">
      <div className="mb-2">
        <h1 className="text-4xl font-bold">Ranking</h1>
      </div>
      <div className="grid w-full grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <div className="mb-2">
            <h2 className="font-bold text-xl border-b-2 border-primary pb-1">
              Países com melhor avaliação
            </h2>
          </div>
          <div>
            <ul className="divide-y-2 min-h-[440px]">
              {ranking.data.countryRatingRanking.map((country) => (
                <div
                  key={country.iso2}
                  className="flex items-center h-[44px] p-4 justify-between"
                >
                  <div className="flex gap-2 items-center">
                    <CountryFlag className="w-[36px]" iso2={country.iso2} />
                    <Link
                      className="hover:underline"
                      href={{
                        params: { slug: country.iso2 },
                        pathname: '/country/[slug]',
                      }}
                    >
                      <span>{country.name}</span>
                    </Link>
                  </div>
                  <div className="flex items-center gap-1">
                    <Rating
                      className="max-w-[92px]"
                      value={country.averageRating}
                      readOnly
                    />
                    <span className="font-bold">{country.averageRating}</span>
                  </div>
                </div>
              ))}
            </ul>
          </div>
        </div>
        <div>
          <div className="mb-2">
            <h2 className="font-bold text-xl border-b-2 border-primary pb-1">
              Cidades com melhor avaliação
            </h2>
          </div>
          <div>
            <ul className="divide-y-2 min-h-[440px]">
              {ranking.data.cityRatingRanking.map((city) => (
                <div
                  key={city.id}
                  className="flex items-center h-[44px] p-4 justify-between"
                >
                  <div className="flex gap-2 items-center">
                    <Link
                      href={{ params: { slug: city.iso2 }, pathname: '/country/[slug]' }}
                    >
                      <CountryFlag
                        className="w-[36px]"
                        iso2={city.iso2}
                        tooltip={city.country}
                      />
                    </Link>
                    <div className="flex gap-1">
                      <Link
                        className="hover:underline"
                        href={{ params: { slug: city.id }, pathname: '/city/[slug]' }}
                      >
                        <span>{city.name}</span>
                      </Link>
                      <span className="text-muted-foreground">{city.region}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Rating
                      className="max-w-[92px]"
                      value={city.averageRating}
                      readOnly
                    />
                    <span className="font-bold">{city.averageRating}</span>
                  </div>
                </div>
              ))}
            </ul>
          </div>
        </div>
        <div>
          <div className="mb-2">
            <h2 className="font-bold text-xl border-b-2 border-primary pb-1">
              Países com maior interesse
            </h2>
          </div>
          <div>
            <ul className="divide-y-2 min-h-[440px]">
              {ranking.data.countryInterestRanking.map((country) => (
                <div
                  key={country.iso2}
                  className="flex items-center h-[44px] p-4 justify-between"
                >
                  <div className="flex gap-2 items-center">
                    <CountryFlag className="w-[36px]" iso2={country.iso2} />
                    <Link
                      className="hover:underline"
                      href={{
                        params: { slug: country.iso2 },
                        pathname: '/country/[slug]',
                      }}
                    >
                      <span>{country.name}</span>
                    </Link>
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
            <h2 className="font-bold text-xl border-b-2 border-primary pb-1">
              Cidades com maior interesse
            </h2>
          </div>
          <ul className="divide-y-2 min-h-[440px]">
            {ranking.data.cityInterestRanking.map((city, index) => (
              <div key={index} className="flex items-center h-[44px] p-4 justify-between">
                <div className="flex gap-2 items-center">
                  <Link
                    href={{
                      params: { slug: city.region.country.iso2 },
                      pathname: '/country/[slug]',
                    }}
                  >
                    <CountryFlag
                      className="w-[36px]"
                      iso2={city.region.country.iso2}
                      tooltip={city.region.country.name}
                    />
                  </Link>
                  <div className="flex gap-1">
                    <Link
                      className="hover:underline"
                      href={{ params: { slug: city.id }, pathname: '/city/[slug]' }}
                    >
                      <span>{city.name}</span>
                    </Link>
                    <span className="text-muted-foreground">{city.region.name}</span>
                  </div>
                </div>
                <div>
                  <span>{city.totalInterest}</span>
                </div>
              </div>
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
            <ul className="divide-y-2 min-h-[440px]">
              {ranking.data.countryVisitRanking.map((country) => (
                <div
                  key={country.iso2}
                  className="flex items-center h-[44px] p-4 justify-between"
                >
                  <div className="flex gap-2 items-center">
                    <CountryFlag className="w-[36px] rounded-sm" iso2={country.iso2} />
                    <Link
                      className="hover:underline"
                      href={{
                        params: { slug: country.iso2 },
                        pathname: '/country/[slug]',
                      }}
                    >
                      <span>{country.name}</span>
                    </Link>
                  </div>
                  <div>
                    <span>{country.totalVisit}</span>
                  </div>
                </div>
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
          <ul className="divide-y-2 min-h-[440px]">
            {ranking.data.cityVisitRanking.map((city, index) => (
              <div key={index} className="flex items-center h-[44px] p-4 justify-between">
                <div className="flex gap-2 items-center">
                  <Link
                    href={{
                      params: { slug: city.region.country.iso2 },
                      pathname: '/country/[slug]',
                    }}
                  >
                    <CountryFlag
                      className="w-[36px] rounded-sm"
                      iso2={city.region.country.iso2}
                      tooltip={city.region.country.name}
                    />
                  </Link>
                  <div className="flex gap-1">
                    <Link
                      className="hover:underline"
                      href={{ params: { slug: city.id }, pathname: '/city/[slug]' }}
                    >
                      <span>{city.name}</span>
                    </Link>
                    <span className="text-muted-foreground">{city.region.name}</span>
                  </div>
                </div>
                <div>
                  <span>{city.totalVisit}</span>
                </div>
              </div>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
