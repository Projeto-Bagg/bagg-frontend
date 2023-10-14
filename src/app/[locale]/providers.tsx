'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { ReactNode, useState } from 'react';
import { ThemeProvider } from '@/components/ui/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '../../context/auth-context';

export const Providers = ({ children }: { children: ReactNode }) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
            retry: false,
            staleTime: Infinity,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <AuthProvider>
          <Toaster />
          {children}
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};
