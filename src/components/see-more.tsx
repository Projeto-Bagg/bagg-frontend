'use client';

import { Link, pathnames } from '@/common/navigation';
import { cn } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import React from 'react';

export const SeeMore = <Pathname extends keyof typeof pathnames>({
  className,
  ...props
}: React.ComponentProps<typeof Link<Pathname>>) => {
  const t = useTranslations();

  return (
    <Link
      {...props}
      className={cn(
        'text-right hover:underline text-xs sm:text-sm font-bold w-full uppercase text-primary',
        className,
      )}
    >
      <div className="flex gap-0.5 items-center justify-end">
        <span>{t('see-more')}</span>
        <ChevronRight className="w-[24px]" />
      </div>
    </Link>
  );
};
