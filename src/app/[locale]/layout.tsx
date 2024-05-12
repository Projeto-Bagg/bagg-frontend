import { ReactNode } from 'react';
import { Metadata } from 'next';
import { getMessages } from 'next-intl/server';
import clsx from 'clsx';
import { Inter } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { Header } from '@/components/header/header';
import { Providers } from '@/app/[locale]/providers';
import { getCookie } from 'cookies-next';
import { cookies } from 'next/headers';
import { decodeJwt } from 'jose';
import { cn } from '@/lib/utils';

const inter = Inter({ subsets: ['latin'], weight: ['400', '500', '600', '700'] });

interface Props {
  children: ReactNode;
  auth: ReactNode;
  params: { locale: string };
}

export const metadata: Metadata = {
  title: 'Bagg',
  description: 'Uma rede social para viajantes',
  openGraph: {
    title: 'Bagg',
    description: 'Uma rede social para viajantes',
    siteName: 'Bagg',
    url: 'https://bagg.azurewebsites.net',
    type: 'website',
    locale: 'pt',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bagg',
    description: 'Uma rede social para viajantes',
  },
};

export default async function LocaleLayout({
  children,
  auth,
  params: { locale },
}: Props) {
  const messages = await getMessages();

  const accessToken = getCookie('bagg.sessionToken', { cookies });
  const jwt = accessToken ? decodeJwt<UserFromJwt>(accessToken) : undefined;

  return (
    <html className="h-full" lang={locale} suppressHydrationWarning>
      <body className={clsx(inter.className, 'flex h-full flex-col')}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Providers>
            {jwt?.role !== 'ADMIN' && <Header />}
            <div className={cn(jwt?.role !== 'ADMIN' && 'top-[3.75rem] relative')}>
              {auth}
              {children}
            </div>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
