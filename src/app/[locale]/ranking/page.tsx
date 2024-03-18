import React from 'react';
import { CountryRatingRanking } from '@/components/country-rating-ranking';
import { CityRatingRanking } from '@/components/city-rating-ranking';
import { CountryVisitRanking } from '@/components/country-visit-ranking';
import { CityVisitRanking } from '@/components/city-visit-ranking';
import { CountryInterestRanking } from '@/components/country-interest-ranking';
import { CityInterestRanking } from '@/components/city-interest-ranking';

export default function Page() {
  return (
    <div className="p-4">
      <div className="mb-2">
        <h1 className="font-bold w-fit text-xl sm:text-2xl border-b-2 border-primary pb-1">
          Ranking
        </h1>
      </div>
      <div className="grid w-full grid-cols-1 sm:grid-cols-2 gap-4">
        <CountryRatingRanking seeMore />
        <CityRatingRanking seeMore />
        <CountryVisitRanking seeMore />
        <CityVisitRanking seeMore />
        <CountryInterestRanking />
        <CityInterestRanking />
      </div>
    </div>
  );
}
