'use client';

import axios from '@/services/axios';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { getCookie, deleteCookie, setCookie, hasCookie } from 'cookies-next';
import { Spinner } from '@/assets';
import {
  QueryObserverResult,
  RefetchOptions,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { useRouter } from '@/common/navigation';
import { decodeJwt } from 'jose';

type AuthContextType = {
  login: (user: UserSignIn) => Promise<void>;
  logout: () => void;
  signUp: (user: UserSignUp) => Promise<AxiosResponse<any, any>>;
  user: FullInfoUser | null | undefined;
  admin: Admin | null | undefined;
  isAuthenticated: boolean;
  isLoading: boolean;
  refetch: (
    options?: RefetchOptions | undefined,
  ) => Promise<QueryObserverResult<FullInfoUser | Admin, Error>>;
};

export const AuthContext = createContext({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const queryClient = useQueryClient();
  const { data: user, refetch: refetchUser } = useQuery<FullInfoUser>({
    queryKey: ['session'],
    queryFn: async () => (await axios.get('users/me')).data,
    enabled: false,
  });
  const router = useRouter();

  const { data: admin, refetch: refetchAdmin } = useQuery<Admin>({
    queryKey: ['session'],
    queryFn: async () => (await axios.get('admin/me')).data,
    enabled: false,
  });

  const isAuthenticated = !!user || !!admin;

  const refetch = useCallback(
    (options?: RefetchOptions | undefined) => {
      const accessToken = getCookie('bagg.sessionToken');

      const jwt = accessToken ? decodeJwt<UserFromJwt>(accessToken) : undefined;

      console.log(jwt);

      if (jwt?.role === 'USER') {
        return refetchUser({ ...options });
      }

      return refetchAdmin({ ...options });
    },
    [refetchAdmin, refetchUser],
  );

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

    const decodedJwt = decodeJwt<UserFromJwt>(data.accessToken);

    if (decodedJwt.role === 'USER') {
      if (!decodedJwt.hasEmailBeenVerified) {
        setCookie('bagg.tempSessionToken', data.accessToken);
        setCookie('bagg.tempRefreshToken', data.refreshToken);
        await new Promise((resolve) => setTimeout(resolve, 100));
        return router.push('/settings/verify-email');
      }
    }

    setCookie('bagg.sessionToken', data.accessToken);
    setCookie('bagg.refreshToken', data.refreshToken);

    queryClient.invalidateQueries();
    await refetch();

    window.history.length > 1 ? router.back() : router.push('/');
    router.refresh();
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

    router.push('/');
    router.refresh();

    queryClient.invalidateQueries();
  };

  return (
    <AuthContext.Provider
      value={{ login, logout, admin, user, isAuthenticated, refetch, signUp, isLoading }}
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
