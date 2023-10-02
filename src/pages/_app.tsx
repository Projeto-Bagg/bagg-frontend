import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { AuthProvider } from '../context/auth-context';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '../components/ui/theme-provider';
import { Toaster } from '../components/ui/toaster';
import { NextIntlClientProvider } from 'next-intl';

const inter = Inter({ subsets: ['latin'] });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <div className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <Toaster />
          <NextIntlClientProvider messages={pageProps.messages}>
            <Component {...pageProps} />
          </NextIntlClientProvider>
        </ThemeProvider>
      </div>
    </AuthProvider>
  );
}
