'use client';

import React, { ReactNode, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/components/ui/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/context/auth-context';
import { OriginTrackerProvider } from '@/context/origin-tracker';
import { TooltipProvider } from '@/components/ui/tooltip';

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
    <OriginTrackerProvider>
      <TooltipProvider delayDuration={200} disableHoverableContent>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <AuthProvider>
              <Toaster />
              {children}
            </AuthProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </TooltipProvider>
    </OriginTrackerProvider>
  );
};
