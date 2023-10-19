'use client';

import axios from '@/services/axios';
import { createContext, useContext, useEffect } from 'react';
import { getCookie, deleteCookie, setCookie } from 'cookies-next';
import { Spinner } from '@/assets';
import { useQuery, useQueryClient } from '@tanstack/react-query';

type AuthContextType = {
  login: (user: UserSignIn) => Promise<void>;
  logout: () => void;
  signUp: (user: UserSignUp) => Promise<{ status: number }>;
  user: User | null | undefined;
  isAuthenticated: boolean;
  isLoading: boolean;
};

export const AuthContext = createContext({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const queryClient = useQueryClient();
  const {
    data: user,
    isLoading,
    refetch,
  } = useQuery<User>(['session'], async () => (await axios.get('users/me')).data, {
    enabled: false,
  });

  const isAuthenticated = !!user;

  useEffect(() => {
    const token = getCookie('bagg.session_token');

    if (token) {
      refetch();
    } else {
      queryClient.setQueryData(['session'], null);
    }
  }, [queryClient, refetch]);

  const login = async (user: UserSignIn) => {
    const { data } = await axios.post('/auth/login', user);
    setCookie('bagg.session_token', data.access_token);

    refetch();
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
      queryClient.setQueryData(['session'], null);
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
            <Spinner
              priority={'true'}
              className="[&>circle]:stroke-foreground"
              width="40"
              height="40"
            />
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
