import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import UserHoverCard from '@/components/user-hovercard';
import { Rating } from '@smastrom/react-rating';
import { intlFormatDistance } from 'date-fns';
import { useLocale } from 'next-intl';
import { Link } from '@/common/navigation';
import React from 'react';

interface Props {
  visits: CityVisit[];
}

export const CityVisits = ({ visits }: Props) => {
  const locale = useLocale();

  return (
    <div>
      <div className="text-sm">LAST REVIEWS</div>
      <Separator className="my-2" />
      <div className="divide-y space-y-2">
        {visits.length === 0 && (
          <div className="py-3 text-sm">
            <span>No reviews yet</span>
          </div>
        )}
        {visits.map((visit) => (
          <div key={visit.id} className="flex">
            <div className="basis-[40px] mr-3">
              <UserHoverCard user={visit.user}>
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
                    <Link
                      href={{
                        params: { slug: visit.user.username },
                        pathname: '/[slug]',
                      }}
                    >
                      <span className="text-foreground">@{visit.user.username}</span>
                    </Link>
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
                  <Rating className="max-w-[72px]" readOnly value={visit.rating} />
                  <span className="font-bold">{visit.rating}</span>
                </div>
              </div>
              <div className="mt-1">
                <span>{visit.message}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
