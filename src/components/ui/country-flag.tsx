'use client';

import Image from 'next/image';
import React from 'react';

type ICountryFlag = Omit<React.ComponentProps<typeof Image>, 'alt' | 'src'> & {
  iso2: string;
};

export const CountryFlag = ({ iso2, ...props }: ICountryFlag) => {
  return (
    <Image
      src={`https://flagicons.lipis.dev/flags/4x3/${iso2.toLowerCase()}.svg`}
      alt=""
      width={20}
      height={15}
      {...props}
    />
  );
};
