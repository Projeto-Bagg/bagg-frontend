import { useState } from 'react';

export const useCreateTip = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);

  return {
    isLoading,
    setIsLoading,
    progress,
    setProgress,
  };
};
