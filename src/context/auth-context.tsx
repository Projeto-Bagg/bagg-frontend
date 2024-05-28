'use client';

import axios from '@/services/axios';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { getCookie, deleteCookie, setCookie, hasCookie } from 'cookies-next';
import {
  QueryObserverResult,
  RefetchOptions,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { usePathname, useRouter } from '@/common/navigation';
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
  const pathname = usePathname();
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
      const accessToken = getCookie('bagg.access-token');

      const jwt = accessToken ? decodeJwt<UserFromJwt>(accessToken) : undefined;

      if (jwt?.role === 'USER') {
        return refetchUser({ ...options });
      }

      return refetchAdmin({ ...options });
    },
    [refetchAdmin, refetchUser],
  );

  useEffect(() => {
    const fetchUser = async () => {
      const token = getCookie('bagg.access-token');

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
    const { data } = await axios.post('/auth/login', user);

    const decodedJwt = decodeJwt<UserFromJwt>(data.accessToken);

    if (decodedJwt.role === 'USER') {
      if (!decodedJwt.hasEmailBeenVerified) {
        deleteCookie('bagg.access-token');
        deleteCookie('bagg.refresh-token');
        setCookie('bagg.temp-session-token', data.accessToken);
        setCookie('bagg.temp-refresh-token', data.refreshToken);
        await new Promise((resolve) => setTimeout(resolve, 200));
        return router.replace('/settings/verify-email');
      }
    }

    setCookie('bagg.access-token', data.accessToken);
    setCookie('bagg.refresh-token', data.refreshToken);
    deleteCookie('bagg.temp-session-token');
    deleteCookie('bagg.temp-refresh-token');

    queryClient.invalidateQueries();
    await refetch();

    if (decodedJwt.role === 'ADMIN') {
      router.push('/admin');
      router.refresh();
      return;
    }

    window.history.length > 1 ? router.back() : router.push('/home');
    await new Promise((resolve) => setTimeout(resolve, 200));
    router.refresh();
  };

  const signUp = async (user: UserSignUp) => {
    if (hasCookie('bagg.access-token')) {
      await refetch();
      router.back();
    }

    return await axios.post('/users', user);
  };

  const logout = () => {
    deleteCookie('bagg.access-token');
    deleteCookie('bagg.refresh-token');
    deleteCookie('bagg.temp-session-token');
    deleteCookie('bagg.temp-refresh-token');
    queryClient.setQueryData(['session'], null);

    router.refresh();

    pathname !== '/home' && queryClient.invalidateQueries();
  };

  return (
    <AuthContext.Provider
      value={{ login, logout, admin, user, isAuthenticated, refetch, signUp, isLoading }}
    >
      {isLoading ? (
        <div className="flex flex-col h-screen gap-2 justify-center items-center">
          <h1 className="text-3xl font-bold">Bagg</h1>
          <div>
            <img
              src={'/spinner.svg'}
              alt=""
              className="dark:invert-0 invert"
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
