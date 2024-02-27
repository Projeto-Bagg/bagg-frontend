'use client';

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import Image from 'next/image';
import React from 'react';
import { twMerge } from 'tailwind-merge';

type ICountryFlag = Omit<React.ComponentProps<typeof Image>, 'alt' | 'src'> & {
  iso2: string;
  tooltip?: string;
};

export const CountryFlag = ({ iso2, tooltip, className, ...props }: ICountryFlag) => {
  if (!tooltip) {
    return (
      <span
        className={twMerge(
          `fi-${iso2.toLocaleLowerCase()} w-[20px] aspect-[4/3] rounded-sm block self-center`,
          className,
        )}
      />
    );
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span
          className={twMerge(
            `fi-${iso2.toLocaleLowerCase()} w-[20px] aspect-[4/3] rounded-sm block self-center`,
            className,
          )}
        />
      </TooltipTrigger>
      <TooltipContent>
        <span>{tooltip}</span>
      </TooltipContent>
    </Tooltip>
  );
};
