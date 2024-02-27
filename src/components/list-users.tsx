'use client';

import React from 'react';
import { useFollow } from '@/hooks/useFollow';
import { useUnfollow } from '@/hooks/useUnfollow';
import { useAuth } from '@/context/auth-context';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Link } from '@/common/navigation';
import { useTranslations } from 'next-intl';
import UserHoverCard from '@/components/user-hovercard';

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
          <UserHoverCard user={user}>
            <Link href={{ params: { slug: user.username }, pathname: '/[slug]' }}>
              <div className="flex items-center gap-3">
                <Avatar className="h-[48px] w-[48px]">
                  <AvatarImage src={user.image} />
                </Avatar>
                <div className="flex flex-col">
                  <span>{user.fullName}</span>
                  <span className="text-muted-foreground text-sm">@{user.username}</span>
                </div>
              </div>
            </Link>
          </UserHoverCard>
          {user.id !== auth.user?.id && (
            <Button
              size={'sm'}
              onClick={() =>
                user.isFollowing
                  ? unfollow.mutate(user.username)
                  : follow.mutate(user.username)
              }
              disabled={!auth.isAuthenticated || follow.isPending || unfollow.isPending}
            >
              {user.isFollowing ? t('follow.following') : t('follow.follow')}
            </Button>
          )}
        </div>
      ))}
    </div>
  );
};
