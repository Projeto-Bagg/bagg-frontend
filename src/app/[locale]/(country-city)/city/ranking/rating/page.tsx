import { CityRatingRanking } from '@/components/ranking/city-rating-ranking';

export default function Page() {
  return <CityRatingRanking count={25} isPagination skeleton={false} showTitle={false} />;
}
