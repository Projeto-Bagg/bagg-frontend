import { CityVisitRanking } from '@/components/city-visit-ranking';
import React from 'react';

export default function Page() {
  return <CityVisitRanking count={25} isPagination skeleton={false} />;
}
