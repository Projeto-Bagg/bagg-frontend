import { useState } from 'react';

interface UploadVideo {
  game: string;
  title: string;
  file: { video?: File; thumbnail: string };
}

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
