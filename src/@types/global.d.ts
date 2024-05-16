type Messages = typeof import('../messages/en.json');
declare interface IntlMessages extends Messages {}

interface User {
  id: number;
  fullName: string;
  username: string;
  bio?: string;
  birthdate: Date;
  createdAt: Date;
  image?: string;
  friendshipStatus: {
    isFollowing: boolean;
    followedBy: boolean;
  };
}

interface Admin {
  id: number;
}

interface UserFromJwt {
  id: number;
  username: string;
  hasEmailBeenVerified: boolean;
  role: 'USER' | 'ADMIN';
}

interface FullInfoUser extends User {
  following: number;
  followers: number;
  city?: City;
}

interface TripDiary {
  id: number;
  title: string;
  message: string;
  city: City;
  createdAt: Date;
  user: User;
  postsAmount?: number;
}

interface DiaryPost {
  id: number;
  message: string;
  likesAmount: number;
  isLiked: boolean;
  createdAt: Date;
  user: User;
  diaryPostMedias: DiaryPostMedia[];
  tripDiary: TripDiary;
}

interface DiaryPostReport extends DiaryPost {
  reasons: {
    reason: ReportReason;
    _count: { reason: number };
  }[];
  _count: {
    diaryPostReport: number;
  };
}

interface Media {
  id: number;
  url: string;
  createdAt: Date;
}

interface Pagination<TData, TPageParam = unknown> {
  pages: Array<TData>;
  pageParams: Array<TPageParam>;
}

interface DiaryPostMedia extends Media {
  diaryId: number;
}

interface TipMedia extends Media {
  tipId: number;
}

interface Tip {
  id: number;
  message: string;
  likesAmount: number;
  isLiked: boolean;
  createdAt: Date;
  user: User;
  city: City;
  tipMedias: TipMedia[];
  commentsAmount: number;
}

interface TipComment {
  id: number;
  message: string;
  createdAt: Date;
  user: User;
  tipId: number;
}

interface TipCommentReport extends TipComment {
  reasons: {
    reason: ReportReason;
    _count: { reason: number };
  }[];
  _count: {
    tipCommentReport: number;
  };
}

interface TipReport extends Tip {
  reasons: {
    reason: ReportReason;
    _count: { reason: number };
  }[];
  _count: {
    tipReport: number;
  };
}

interface UserSignIn {
  login: string;
  password: string;
}

interface UserSignUp {
  fullName: string;
  username: string;
  birthdate: Date;
  email: string;
  password: string;
}

interface Country {
  id: number;
  name: string;
  capital: string;
  iso2: string;
  latitude: number;
  longitude: number;
  states: Region[];
}

interface CountryPage extends Country {
  visitsCount: number;
  interestsCount: number;
  averageRating: number | null;
  residentsCount: number;
  reviewsCount: number;
}

interface Region {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  cities: City[];
  country: Country;
}

interface CreateCityVisit {
  rating?: number | null;
  message?: string | null;
  cityId: number;
}

interface CityVisit {
  id: number;
  createdAt: Date;
  rating?: number | null;
  message?: string | null;
  user: User;
}

interface CountryCityVisit extends CityVisit {
  city: City;
}

interface UserCityVisit {
  id: number;
  createdAt: Date;
  rating?: number;
  message?: string;
  city: City;
}

interface Continent {
  id: number;
  name: 'Africa' | 'Europe' | 'Americas' | 'Asia' | 'Antarctica' | 'Oceania';
}

interface City {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  region: Region;
}

interface TrendingCity extends City {
  variation: number;
  variationPercentage: number | null;
  interestsCount: number;
  percentFromTotal: number;
}

interface CityPage extends City {
  isVisited: boolean;
  isInterested: boolean;
  userVisit: CityVisit | null;
  averageRating: number | null;
  interestsCount: number;
  visitsCount: number;
  residentsCount: number;
  reviewsCount: number;
}

interface CountryCityImage extends Media {
  userId: number;
  user: User;
  city?: City;
}

interface CityFromSearch {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  iso2: string;
  region: string;
  country: string;
}

interface Ranking {
  countryInterestRanking: CountryInterestRanking;
  countryVisitRanking: CountryVisitRanking;
  countryRatingRanking: CountryRatingRanking;
  cityInterestRanking: CityInterestRanking;
  cityVisitRanking: CityVisitRanking;
  cityRatingRanking: CityRatingRanking;
}

type CountryInterestRanking = {
  iso2: string;
  name: string;
  totalInterest: number;
}[];

type CountryVisitRanking = {
  iso2: string;
  name: string;
  totalVisit: number;
}[];

type CountryRatingRanking = {
  iso2: string;
  name: string;
  averageRating: number;
}[];

type CityInterestRanking = {
  id: number;
  iso2: string;
  region: string;
  country: string;
  name: string;
  totalInterest: number;
}[];

type CityVisitRanking = {
  id: number;
  iso2: string;
  region: string;
  country: string;
  name: string;
  totalVisit: number;
}[];

type CityRatingRanking = {
  id: number;
  iso2: string;
  region: string;
  country: string;
  name: string;
  averageRating: number;
}[];

interface FullSearch {
  users: User[];
  countries: Country[];
  cities: CityFromSearch[];
  tips: Tip[];
}

type ReportReason = 'hate' | 'violent' | 'spam' | 'nudity' | 'false-information';

interface AdminDashboard {
  totalUsers: number;
  totalReports: number;
  totalPosts: number;
}

interface Ad {
  adImg: import('next/image').StaticImageData;
  url: string;
}
