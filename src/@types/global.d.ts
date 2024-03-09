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
  isInterested: boolean;
  visits: CityVisit[];
  images: Media[];
  userVisit: CityVisit | null;
  averageRating: number;
  interestsCount: number;
  visitsCount: number;
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
  region: Region;
  name: string;
  totalInterest: number;
}[];

type CityVisitRanking = {
  id: number;
  region: Region;
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
