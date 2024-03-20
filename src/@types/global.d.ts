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
  following: number;
  followers: number;
  friendshipStatus: {
    isFollowing: boolean;
    followedBy: boolean;
  };
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
  likedBy: number;
  isLiked: boolean;
  createdAt: Date;
  user: User;
  diaryPostMedias: DiaryPostMedia[];
  tripDiary: TripDiary;
}

interface Media {
  id: number;
  url: string;
  createdAt: Date;
}

interface Pagination<T> {
  pageParams: number[];
  pages: T[][];
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
  likedBy: number;
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
  residentsCount: number;
  interestsCount: number;
  averageRating: number | null;
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
  rating?: number;
  message?: string;
  cityId: number;
}

interface CityVisit {
  id: number;
  createdAt: Date;
  rating?: number;
  message?: string;
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

interface City {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  region: Region;
}

interface CityPage extends City {
  isVisited: boolean;
  residentsCount: number;
  isInterested: boolean;
  userVisit: CityVisit | null;
  averageRating: number | null;
  interestsCount: number;
  visitsCount: number;
}

interface CityImage extends Media {
  userId: number;
  user: User;
}

interface CountryImage extends Media {
  userId: number;
  user: User;
  city: City;
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
}
