import { CountryRatingRanking } from '@/components/ranking/country-rating-ranking';
import React from 'react';

export default function Page() {
  return (
    <CountryRatingRanking count={25} isPagination skeleton={false} showTitle={false} />
  );
}
