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
  title: string;
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
