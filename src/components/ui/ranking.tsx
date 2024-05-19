import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { HTMLProps, forwardRef } from 'react';

export const Ranking = forwardRef<HTMLDivElement, HTMLProps<HTMLDivElement>>(
  ({ className, ...props }, forwardRef) => (
    <div ref={forwardRef} className={className} {...props} />
  ),
);

Ranking.displayName = 'Ranking';

export const RankingHeader = forwardRef<HTMLDivElement, HTMLProps<HTMLDivElement>>(
  ({ className, ...props }, forwardRef) => (
    <div ref={forwardRef} className={cn('mb-2', className)} {...props} />
  ),
);

RankingHeader.displayName = 'RankingHeader';

export const RankingTitle = forwardRef<HTMLDivElement, HTMLProps<HTMLDivElement>>(
  ({ className, ...props }, forwardRef) => (
    <h2
      ref={forwardRef}
      className={cn(
        'font-bold text-base sm:text-xl border-b-2 border-primary pb-1',
        className,
      )}
      {...props}
    />
  ),
);

RankingTitle.displayName = 'RankingTitle';

export const RankingContent = forwardRef<HTMLUListElement, HTMLProps<HTMLUListElement>>(
  ({ className, ...props }, forwardRef) => (
    <ul
      ref={forwardRef}
      className={cn(
        'divide-y-2 [&>*:nth-child(1)_h3]:text-yellow-500 [&>*:nth-child(2)_h3]:text-gray-400 [&>*:nth-child(3)_h3]:text-orange-400',
        className,
      )}
      {...props}
    />
  ),
);

RankingContent.displayName = 'RankingContent';

export const RankingItem = forwardRef<HTMLLIElement, HTMLProps<HTMLLIElement>>(
  ({ className, ...props }, forwardRef) => (
    <li
      ref={forwardRef}
      className={cn('flex items-center h-[44px] p-3 justify-between', className)}
      {...props}
    />
  ),
);

RankingItem.displayName = 'RankingItem';

export const RankingFooter = forwardRef<HTMLDivElement, HTMLProps<HTMLDivElement>>(
  ({ className, ...props }, forwardRef) => (
    <div ref={forwardRef} className={cn('w-full text-right', className)} {...props} />
  ),
);

RankingFooter.displayName = 'RankingFooter';

export const RankingSkeleton = ({ count = 10 }) => {
  return Array.from(Array(count), (_, i) => i + 1).map((_, i) => (
    <li key={i} className="flex items-center h-[44px] p-3 justify-between">
      <div className="flex gap-2 items-center">
        <Skeleton className="h-4 w-[24px]" />
        <Skeleton className="w-[36px] h-[27px]" />
        <Skeleton className="w-[144px] h-4" />
      </div>
      <div>
        <Skeleton className="w-[32px] h-4" />
      </div>
    </li>
  ));
};
