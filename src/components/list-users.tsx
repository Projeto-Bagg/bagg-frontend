'use client';

import React from 'react';
import { useFollow, useUnfollow } from '@/hooks/user';
import { useAuth } from '@/context/auth-context';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Link } from '@/common/navigation';
import { useTranslations } from 'next-intl';
import { UserHoverCard } from '@/components/user-hovercard';

interface IListUsers {
  users: User[];
  transparent?: boolean;
  showIfUserFollowYou?: boolean;
}

export const ListUsers = ({ users, showIfUserFollowYou = true }: IListUsers) => {
  const auth = useAuth();
  const follow = useFollow();
  const unfollow = useUnfollow();
  const t = useTranslations();

  return (
    <div className="space-y-1.5">
      {users.map((user) => (
        <div key={user.id} className="flex justify-between items-center transition-all">
          <div className="flex items-center gap-2">
            <UserHoverCard username={user.username}>
              <Link href={{ params: { slug: user.username }, pathname: '/[slug]' }}>
                <Avatar className="h-[48px] w-[48px]">
                  <AvatarImage src={user.image} />
                </Avatar>
              </Link>
            </UserHoverCard>
            <div className="flex flex-col">
              <UserHoverCard username={user.username}>
                <Link
                  className="hover:underline"
                  href={{ params: { slug: user.username }, pathname: '/[slug]' }}
                >
                  {user.fullName}
                </Link>
              </UserHoverCard>
              <UserHoverCard username={user.username}>
                <Link
                  className="text-muted-foreground text-sm hover:underline"
                  href={{ params: { slug: user.username }, pathname: '/[slug]' }}
                >
                  @{user.username}
                </Link>
              </UserHoverCard>
            </div>
          </div>
          {user.id !== auth.user?.id && (
            <Button
              size={'sm'}
              onClick={() =>
                user.friendshipStatus.isFollowing
                  ? unfollow.mutate(user)
                  : follow.mutate(user)
              }
              disabled={!auth.isAuthenticated || follow.isPending || unfollow.isPending}
            >
              {user.friendshipStatus.isFollowing
                ? t('follow.following')
                : t('follow.follow')}
            </Button>
          )}
        </div>
      ))}
    </div>
  );
};
