import { Link } from '@/common/navigation';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
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
    <div {...props} ref={forwardRef} className="p-3 flex items-center gap-2">
      <Link href={{ params: { slug: user.username }, pathname: '/[slug]' }}>
        <Avatar className="w-[64px] h-[64px]">
          <AvatarImage src={user.image} />
        </Avatar>
      </Link>
      <div className="flex flex-col justify-center">
        <div>
          <Link
            className="hover:underline"
            href={{ params: { slug: user.username }, pathname: '/[slug]' }}
          >
            {user.fullName}
          </Link>{' '}
          <Link
            className="text-muted-foreground hover:underline"
            href={{ params: { slug: user.username }, pathname: '/[slug]' }}
          >
            @{user.username}
          </Link>
        </div>
        <span className="text-sm">{user.bio}</span>
      </div>
      {auth.user?.id !== user.id && (
        <div className="flex justify-center flex-1">
          <Button
            size={'sm'}
            onClick={() =>
              user.friendshipStatus.isFollowing
                ? unfollow.mutate(user)
                : follow.mutate(user)
            }
          >
            {user.friendshipStatus.isFollowing
              ? t('follow.following')
              : t('follow.follow')}
          </Button>
        </div>
      )}
    </div>
  );
});

Resident.displayName = 'Resident';
