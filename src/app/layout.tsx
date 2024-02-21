import { ReactNode } from 'react';
import '@/app/globals.css';
import '/node_modules/flag-icons/css/flag-icons.min.css';

type Props = {
  children: ReactNode;
};

export default function RootLayout({ children }: Props) {
  return children;
}
