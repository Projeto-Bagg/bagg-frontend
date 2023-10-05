'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { getCookie, deleteCookie, setCookie } from 'cookies-next';
import axios from '@/services/axios';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { Spinner } from '../assets';

type User = {
  id: string;
  fullName: string;
  username: string;
  email: string;
  birthdate: Date;
  image: string;
};

type UserSignIn = {
  login: string;
  password: string;
};

type UserSignUp = {
  fullName: string;
  username: string;
  birthdate: Date;
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
      {isLoading ? (
        <div className="flex flex-col h-screen gap-2 justify-center items-center">
          <h1 className="text-3xl font-bold">Bagg</h1>
          <div>
            <Spinner className="[&>circle]:stroke-foreground" width="40" height="40" />
          </div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
