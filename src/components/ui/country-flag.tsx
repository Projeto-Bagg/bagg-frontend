'use client';

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import React, { HTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

type ICountryFlag = HTMLAttributes<HTMLSpanElement> & {
  iso2: string;
  tooltip?: string;
};

export const CountryFlag = ({ iso2, tooltip, className, ...props }: ICountryFlag) => {
  if (!tooltip) {
    return (
      <span
        className={twMerge(
          `fi-${iso2.toLocaleLowerCase()} border w-[20px] aspect-[4/3] rounded-sm block self-center`,
          className,
        )}
        {...props}
      />
    );
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span
          className={twMerge(
            `fi-${iso2.toLocaleLowerCase()} border w-[20px] aspect-[4/3] rounded-sm block self-center`,
            className,
          )}
          {...props}
        />
      </TooltipTrigger>
      <TooltipContent>
        <span>{tooltip}</span>
      </TooltipContent>
    </Tooltip>
  );
};
