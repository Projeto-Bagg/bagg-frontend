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
  isFollowing: boolean;
  followedBy: boolean;
}

interface TripDiary {
  id: number;
  title: string;
  message: string;
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
  diaryPostMedias: Media[];
  tripDiary: TripDiary;
}

interface Media {
  id: number;
  url: string;
  createdAt: Date;
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
  latitude: string;
  longitude: string;
  states: Region[];
}

interface Region {
  id: number;
  name: string;
  latitude: string;
  longitude: string;
  cities: City[];
  country: Country;
}

interface City {
  id: number;
  name: string;
  latitude: string;
  longitude: string;
  isVisited: boolean;
  isInterested: boolean;
  region: Region;
}

interface Ranking {
  mostInterestedCountries: CountryInterestRanking;
  mostInterestedCities: CityInterestRanking;
}

type CountryInterestRanking = {
  iso2: string;
  name: string;
  totalInterest: number;
}[];

type CityInterestRanking = {
  id: number;
  countryIso2: string;
  countryName: string;
  name: string;
  totalInterest: number;
}[];
