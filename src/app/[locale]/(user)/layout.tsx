import { ReactNode } from 'react';
import { Header } from '@/components/header/header';

interface Props {
  children: ReactNode;
}

export default async function LocaleLayout({ children }: Props) {
  return (
    <>
      <Header />
      <div className="top-[3.75rem] relative">{children}</div>
    </>
  );
}
