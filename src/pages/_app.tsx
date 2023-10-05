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
  const [queryClient] = useState(() => new QueryClient());

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <Hydrate state={pageProps.dehydratedState}>
          <div className={inter.className}>
            <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
              <Toaster />
              <NextSeo
                title="Bagg"
                openGraph={{
                  title: 'Bagg',
                  description: 'x',
                }}
              />
              <NextIntlClientProvider messages={pageProps.messages}>
                <Header />
                <div className="container">
                  <Component {...pageProps} />
                </div>
              </NextIntlClientProvider>
            </ThemeProvider>
          </div>
        </Hydrate>
      </QueryClientProvider>
    </AuthProvider>
  );
}
