import clsx from 'clsx';
import { Inter } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { ReactNode } from 'react';
import { Header } from '@/components/header';
import { Providers } from '@/app/[locale]/providers';
import { Metadata } from 'next';
import { getMessages } from 'next-intl/server';

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

  return (
    <html className="h-full" lang={locale} suppressHydrationWarning>
      <body className={clsx(inter.className, 'flex h-full flex-col')}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Providers>
            <Header />
            <div className="container md:border-l md:border-r md:border-b">
              {auth}
              {children}
            </div>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
