'use client';

import Image from 'next/image';
import React from 'react';
import DarkRanking from '@/assets/dark-ranking.png';
import LightRanking from '@/assets/light-ranking.png';
import { useTheme } from 'next-themes';

export const Ranking = () => {
  const { theme } = useTheme();

  return <Image src={theme === 'dark' ? DarkRanking : LightRanking} alt="" />;
};
