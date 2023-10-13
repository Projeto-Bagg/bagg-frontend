import { useState } from 'react';
import type { AppProps } from 'next/app';
import '@/styles/globals.css';
import { Hydrate, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/context/auth-context';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/ui/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { Header } from '@/components/header';
import { NextIntlClientProvider } from 'next-intl';
import { NextSeo } from 'next-seo';

const inter = Inter({ subsets: ['latin'] });

export default function App({ Component, pageProps }: AppProps) {
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
      <Hydrate state={pageProps.dehydratedState}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <NextIntlClientProvider messages={pageProps.messages}>
            <div className={inter.className}>
              <AuthProvider>
                <Header />
                <div className="container border-x min-h-[calc(100vh-56px)]">
                  <Component {...pageProps} />
                </div>
                <Toaster />
                <NextSeo
                  title="Bagg"
                  openGraph={{
                    title: 'Bagg',
                    description: 'x',
                  }}
                />
              </AuthProvider>
            </div>
          </NextIntlClientProvider>
        </ThemeProvider>
      </Hydrate>
    </QueryClientProvider>
  );
}
