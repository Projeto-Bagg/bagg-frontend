import React, { HTMLProps, forwardRef } from 'react';
import { UserHoverCard } from '@/components/user-hovercard';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Rating } from '@smastrom/react-rating';
import { intlFormatDistance } from 'date-fns';
import { useLocale } from 'next-intl';
import { Link } from '@/common/navigation';

export const CityVisit = forwardRef<
  HTMLDivElement,
  HTMLProps<HTMLDivElement> & {
    visit: CityVisit;
    city?: City;
  }
>(({ visit, city, ...props }, forwardRef) => {
  const locale = useLocale();

  return (
    <div ref={forwardRef} className="flex border-b py-3">
      <div className="basis-[40px] mr-3">
        <UserHoverCard username={visit.user.username}>
          <Link
            href={{ params: { slug: visit.user.username }, pathname: '/[slug]' }}
            className="h-fit"
          >
            <Avatar className="h-[44px] w-[44px] shrink-0">
              <AvatarImage src={visit.user.image} />
            </Avatar>
          </Link>
        </UserHoverCard>
      </div>
      <div>
        <div className="text-muted-foreground text-sm">
          <div className="flex gap-1">
            <div>
              Visited by{' '}
              <UserHoverCard username={visit.user.username}>
                <Link
                  href={{
                    params: { slug: visit.user.username },
                    pathname: '/[slug]',
                  }}
                  className="text-foreground hover:underline"
                >
                  @{visit.user.username}
                </Link>
              </UserHoverCard>
            </div>
            {' • '}
            <span>
              {intlFormatDistance(visit.createdAt, new Date(), {
                numeric: 'always',
                style: 'narrow',
                locale,
              })}
            </span>
          </div>
          <div className="flex gap-1">
            <Rating className="max-w-[72px]" readOnly value={visit.rating || 0} />
            <span className="font-bold text-foreground">{visit.rating}</span>
            {city && (
              <>
                {' • '}
                <Link
                  className="hover:underline text-primary"
                  href={{
                    params: { slug: city.id },
                    pathname: '/city/[slug]',
                  }}
                >
                  {city.name}
                </Link>
              </>
            )}
          </div>
        </div>
        <div className="mt-1">
          <span>{visit.message}</span>
        </div>
      </div>
    </div>
  );
});

CityVisit.displayName = 'CityVisit';
