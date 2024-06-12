import { CountryVisitRanking } from '@/components/ranking/country-visit-ranking';

import React from 'react';

export default function Page() {
  return (
    <CountryVisitRanking count={25} isPagination skeleton={false} showTitle={false} />
  );
}
