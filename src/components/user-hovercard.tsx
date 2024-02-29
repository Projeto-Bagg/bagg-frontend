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
import { useFollow } from '@/hooks/useFollow';
import { useUnfollow } from '@/hooks/useUnfollow';
import axios from '@/services/axios';
import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import React, { ReactNode, useState } from 'react';

interface UserHoverCardProps {
  username: string;
  children: ReactNode;
}

export default function UserHoverCard({ username, children }: UserHoverCardProps) {
  const auth = useAuth();
  const follow = useFollow();
  const unfollow = useUnfollow();
  const router = useRouter();
  const t = useTranslations();
  const [open, setOpen] = useState<boolean>();

  const user = useQuery<User>({
    queryKey: ['user', username],
    queryFn: async () => (await axios.get<User>('/users/' + username)).data,
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
      ? unfollow.mutate(user.data.username)
      : follow.mutate(user.data.username);
  };

  return (
    <HoverCard open={open} onOpenChange={setOpen}>
      <HoverCardTrigger asChild>{children}</HoverCardTrigger>
      <HoverCardContent>
        {user.isLoading && <></>}
        {!user.isLoading && user.data && (
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <Avatar className="w-[3rem] h-[3rem]">
                <AvatarImage src={user.data.image} />
              </Avatar>
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
              <div className="flex gap-1 items-baseline">
                <span className="font-bold">{user.data.fullName}</span>
                <span className="text-sm text-muted-foreground">
                  @{user.data.username}
                </span>
              </div>
              {user.data.bio && (
                <span className="text-xs break-words whitespace-pre-wrap">
                  {user.data.bio}
                </span>
              )}
            </div>
            <div>
              {user.data.city && (
                <div className="text-muted-foreground flex gap-1 text-xs">
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
              <div className="text-xs">
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
}
