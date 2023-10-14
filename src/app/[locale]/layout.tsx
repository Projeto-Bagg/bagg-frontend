import clsx from 'clsx';
import { Inter } from 'next/font/google';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { ReactNode } from 'react';
import { Header } from '../../components/header';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

interface Props {
  children: ReactNode;
  auth: ReactNode;
  params: { locale: string };
}

async function getMessages(locale: string) {
  try {
    return (await import(`../../messages/${locale}.json`)).default;
  } catch (error) {
    notFound();
  }
}

export async function generateStaticParams() {
  return ['en', 'pt'].map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  auth,
  params: { locale },
}: Props) {
  const messages = await getMessages(locale);

  return (
    <html className="h-full" lang={locale} suppressHydrationWarning>
      <body className={clsx(inter.className, 'flex h-full flex-col')}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Providers>
            <Header />
            <div className="container border-x min-h-[calc(100vh-56px)]">
              {children}
              {auth}
            </div>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
