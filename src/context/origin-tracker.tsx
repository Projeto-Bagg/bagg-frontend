'use client';

import { usePathname } from 'next/navigation';
import { useState, createContext, useEffect, useContext } from 'react';

export const OriginContext = createContext<boolean>(false);

export const OriginTrackerProvider = ({ children }: React.PropsWithChildren) => {
  const [isWithinPage, setIsWithinPage] = useState(false);
  const pathname = usePathname();
  const [path] = useState<string>(pathname);

  useEffect(() => {
    if (pathname !== path) {
      setIsWithinPage(true);
    }
  }, [pathname, path]);

  return <OriginContext.Provider value={isWithinPage}>{children}</OriginContext.Provider>;
};

export const useOriginTracker = () => {
  return useContext(OriginContext);
};
