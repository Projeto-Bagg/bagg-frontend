import React from 'react';
import { CountryRatingRanking } from '@/components/ranking/country-rating-ranking';
import { CityRatingRanking } from '@/components/ranking/city-rating-ranking';
import { CountryVisitRanking } from '@/components/ranking/country-visit-ranking';
import { CityVisitRanking } from '@/components/ranking/city-visit-ranking';
import { TrendingCities } from '@/app/[locale]/ranking/components/trending-cities';

export default function Page() {
  return (
    <div className="p-4">
      <div className="mb-2">
        <h2 className="font-bold w-fit text-xl sm:text-2xl border-b-2 border-primary pb-1">
          Ranking
        </h2>
      </div>
      <TrendingCities />
      <div className="grid w-full grid-cols-1 sm:grid-cols-2 gap-4">
        <CountryRatingRanking seeMore skeleton />
        <CountryVisitRanking seeMore skeleton />
        <CityRatingRanking seeMore skeleton />
        <CityVisitRanking seeMore skeleton />
      </div>
    </div>
  );
}
