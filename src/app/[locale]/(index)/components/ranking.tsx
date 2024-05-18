'use client';

import React from 'react';
import { useTheme } from 'next-themes';

export const Ranking = () => {
  const { resolvedTheme } = useTheme();

  return (
    <img
      src={
        resolvedTheme === 'dark'
          ? '/images/dark-ranking.png'
          : '/images/light-ranking.png'
      }
      alt=""
    />
  );
};
