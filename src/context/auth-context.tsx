'use client';

import axios from '@/services/axios';
import { createContext, useContext, useEffect, useState } from 'react';
import { getCookie, deleteCookie, setCookie, hasCookie } from 'cookies-next';
import { Spinner } from '@/assets';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { useRouter } from '@/common/navigation';

type AuthContextType = {
  login: (user: UserSignIn) => Promise<void>;
  logout: () => void;
  signUp: (user: UserSignUp) => Promise<AxiosResponse<any, any>>;
  user: FullInfoUser | null | undefined;
  isAuthenticated: boolean;
  isLoading: boolean;
};

export const AuthContext = createContext({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const queryClient = useQueryClient();
  const { data: user, refetch } = useQuery<FullInfoUser>({
    queryKey: ['session'],
    queryFn: async () => (await axios.get('users/me')).data,
    enabled: false,
  });
  const router = useRouter();

  const isAuthenticated = !!user;

  useEffect(() => {
    const fetchUser = async () => {
      const token = getCookie('bagg.sessionToken');

      if (token) {
        await refetch();
      } else {
        queryClient.setQueryData(['session'], null);
      }
    };
    fetchUser().then(() => {
      setIsLoading(false);
    });
  }, [queryClient, refetch]);

  const login = async (user: UserSignIn) => {
    if (hasCookie('bagg.sessionToken')) {
      await refetch();
      router.back();
    }

    const { data } = await axios.post('/auth/login', user);
    setCookie('bagg.sessionToken', data.accessToken);
    setCookie('bagg.refreshToken', data.refreshToken);
    queryClient.invalidateQueries();
    await refetch();
  };

  const signUp = async (user: UserSignUp) => {
    if (hasCookie('bagg.sessionToken')) {
      await refetch();
      router.back();
    }

    return await axios.post('/users', user);
  };

  const logout = () => {
    deleteCookie('bagg.sessionToken');
    deleteCookie('bagg.refreshToken');
    queryClient.setQueryData(['session'], null);
    queryClient.invalidateQueries();
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
