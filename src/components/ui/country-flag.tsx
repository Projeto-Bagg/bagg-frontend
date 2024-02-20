'use client';

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import Image from 'next/image';
import React from 'react';

type ICountryFlag = Omit<React.ComponentProps<typeof Image>, 'alt' | 'src'> & {
  iso2: string;
  tooltip?: string;
};

export const CountryFlag = ({ iso2, tooltip, ...props }: ICountryFlag) => {
  if (!tooltip) {
    return (
      <Image
        src={`https://flagicons.lipis.dev/flags/4x3/${iso2.toLowerCase()}.svg`}
        alt=""
        width={20}
        height={15}
        {...props}
      />
    );
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Image
          src={`https://flagicons.lipis.dev/flags/4x3/${iso2.toLowerCase()}.svg`}
          alt=""
          width={20}
          height={15}
          {...props}
        />
      </TooltipTrigger>
      <TooltipContent>
        <span>{tooltip}</span>
      </TooltipContent>
    </Tooltip>
  );
};
