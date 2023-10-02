'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { getCookie, deleteCookie, setCookie } from 'cookies-next';
import axios from '@/services/axios';
import { useRouter } from 'next/router';

type User = {
  id: string;
  displayName: string;
  username: string;
  email: string;
  birthdate: Date;
  image: string;
};

type UserSignIn = {
  email: string;
  password: string;
};

type UserSignUp = {
  displayName: string;
  username: string;
  email: string;
  password: string;
};

type AuthContextType = {
  login: (user: UserSignIn) => Promise<void>;
  logout: () => void;
  signUp: (user: UserSignUp) => Promise<{ status: number }>;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
};

export const AuthContext = createContext({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  const isAuthenticated = !!user;

  useEffect(() => {
    const token = getCookie('bagg.session_token') as string;

    if (token) {
      axios.get<User>('users/me').then((response) => setUser(response.data));
    }

    setIsLoading(false);
  }, []);

  const login = async (user: UserSignIn) => {
    const { data } = await axios.post('/auth/login', user);

    setCookie('bagg.session_token', data.access_token);

    router.reload();
  };

  const signUp = async (user: UserSignUp) => {
    const { status } = await axios.post('users', user);

    return {
      status,
    };
  };

  const logout = () => {
    try {
      deleteCookie('bagg.session_token');
      router.reload();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <AuthContext.Provider
      value={{ login, logout, user, isAuthenticated, signUp, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
