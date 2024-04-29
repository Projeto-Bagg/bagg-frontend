import { CityVisitRanking } from '@/components/ranking/city-visit-ranking';
import React from 'react';

export default function Page() {
  return <CityVisitRanking count={25} isPagination skeleton={false} showTitle={false} />;
}
