'use client';

import { Link, useRouter } from '@/common/navigation';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { CountryFlag } from '@/components/ui/country-flag';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { useAuth } from '@/context/auth-context';
import { useFollow, useUnfollow } from '@/hooks/user';
import axios from '@/services/axios';
import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import React, { ReactNode, useState } from 'react';

interface UserHoverCardProps {
  username: string;
  children: ReactNode;
}

export const UserHoverCard = ({ username, children }: UserHoverCardProps) => {
  const auth = useAuth();
  const follow = useFollow();
  const unfollow = useUnfollow();
  const router = useRouter();
  const t = useTranslations();
  const [open, setOpen] = useState<boolean>();

  const user = useQuery<FullInfoUser>({
    queryKey: ['user', username],
    queryFn: async () => (await axios.get<FullInfoUser>('/users/' + username)).data,
    enabled: !!open,
  });

  const handleFollowClick = () => {
    if (!auth.isAuthenticated) {
      return router.push('/login');
    }

    if (!user.data) {
      return;
    }

    user.data.friendshipStatus.isFollowing
      ? unfollow.mutate(user.data)
      : follow.mutate(user.data);
  };

  return (
    <HoverCard open={open} onOpenChange={setOpen}>
      <HoverCardTrigger asChild>{children}</HoverCardTrigger>
      <HoverCardContent>
        {user.isLoading && <></>}
        {!user.isLoading && user.data && (
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <Link href={{ params: { slug: user.data.username }, pathname: '/[slug]' }}>
                <Avatar className="w-[3rem] h-[3rem]">
                  <AvatarImage src={user.data.image} />
                </Avatar>
              </Link>
              {auth.user?.id !== user.data.id && (
                <Button
                  size={'sm'}
                  type="button"
                  disabled={follow.isPending}
                  onClick={handleFollowClick}
                >
                  {user.data?.friendshipStatus.isFollowing
                    ? t('follow.following')
                    : t('follow.follow')}
                </Button>
              )}
            </div>
            <div className="mt-2 gap-1 flex-col flex">
              <div className="flex flex-col">
                <Link
                  className="hover:underline font-bold"
                  href={{ params: { slug: user.data.username }, pathname: '/[slug]' }}
                >
                  {user.data.fullName}
                </Link>
                <Link
                  className="hover:underline text-sm text-muted-foreground"
                  href={{ params: { slug: user.data.username }, pathname: '/[slug]' }}
                >
                  @{user.data.username}
                </Link>
                {user.data.bio && (
                  <span className="text-sm break-words whitespace-pre-wrap">
                    {user.data.bio}
                  </span>
                )}
              </div>
            </div>
            <div>
              {user.data.city && (
                <div className="text-muted-foreground flex gap-1 text-sm">
                  <p>{t('profile.city')}</p>
                  <Link
                    href={{
                      params: { slug: user.data.city.id },
                      pathname: '/city/[slug]',
                    }}
                    className="text-foreground flex hover:underline"
                  >
                    {user.data.city.name}
                    <CountryFlag
                      className="ml-1"
                      iso2={user.data.city.region.country.iso2}
                    />
                  </Link>
                </div>
              )}
              <div className="text-sm">
                <div className="flex gap-2">
                  <div className="flex gap-1">
                    <span className="font-bold">{user.data.followers}</span>
                    <span className="text-muted-foreground">{t('follow.followers')}</span>
                  </div>
                  <div className="flex gap-1">
                    <span className="font-bold">{user.data.following}</span>
                    <span className="text-muted-foreground">{t('follow.following')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </HoverCardContent>
    </HoverCard>
  );
};
