import { Link } from '@/common/navigation';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { UserHoverCard } from '@/components/user-hovercard';
import { useAuth } from '@/context/auth-context';
import { useFollow, useUnfollow } from '@/hooks/user';
import { useTranslations } from 'next-intl';
import React, { HTMLProps, forwardRef } from 'react';

export const Resident = forwardRef<
  HTMLDivElement,
  HTMLProps<HTMLDivElement> & {
    user: User;
  }
>(({ user, ...props }, forwardRef) => {
  const follow = useFollow();
  const unfollow = useUnfollow();
  const auth = useAuth();
  const t = useTranslations();

  return (
    <div
      {...props}
      ref={forwardRef}
      className="p-3 flex justify-between items-center gap-2"
    >
      <div className="flex items-center gap-2 min-w-0">
        <UserHoverCard username={user.username}>
          <Link href={{ params: { slug: user.username }, pathname: '/[slug]' }}>
            <Avatar className="w-[64px] h-[64px]">
              <AvatarImage src={user.image} />
            </Avatar>
          </Link>
        </UserHoverCard>
        <div className="flex flex-col">
          <UserHoverCard username={user.username}>
            <Link
              className="hover:underline mr-1 truncate min-w-0"
              href={{ params: { slug: user.username }, pathname: '/[slug]' }}
            >
              {user.fullName}
            </Link>
          </UserHoverCard>
          <UserHoverCard username={user.username}>
            <Link
              className="text-muted-foreground text-sm hover:underline shrink-0"
              href={{ params: { slug: user.username }, pathname: '/[slug]' }}
            >
              @{user.username}
            </Link>
          </UserHoverCard>
          <span className="text-sm text-muted-foreground line-clamp-1">{user.bio}</span>
        </div>
      </div>
      {auth.user?.id !== user.id && (
        <Button
          size="sm"
          onClick={() =>
            user.friendshipStatus.isFollowing
              ? unfollow.mutate(user)
              : follow.mutate(user)
          }
        >
          {user.friendshipStatus.isFollowing ? t('follow.following') : t('follow.follow')}
        </Button>
      )}
    </div>
  );
});

Resident.displayName = 'Resident';
