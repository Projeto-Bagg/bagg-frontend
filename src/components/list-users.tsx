import React from 'react';
import { useFollow } from '@/hooks/useFollow';
import { useUnfollow } from '@/hooks/useUnfollow';
import { useAuth } from '@/context/auth-context';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface IListUsers {
  users: User[];
  transparent?: boolean;
  showIfUserFollowYou?: boolean;
}

export const ListUsers = ({ users, showIfUserFollowYou = true }: IListUsers) => {
  const auth = useAuth();
  const follow = useFollow();
  const unfollow = useUnfollow();

  return users.map((user) => (
    <div
      key={user.id}
      className="flex justify-between items-center px-3 py-1 transition-all"
    >
      <Link href={'/' + user.username}>
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
      {user.id !== auth.user?.id && (
        <Button
          onClick={() =>
            user.isFollowing
              ? unfollow.mutate(user.username)
              : follow.mutate(user.username)
          }
          disabled={!auth.isAuthenticated || follow.isLoading || unfollow.isLoading}
        >
          {user.isFollowing ? 'Parar de seguir' : 'Seguir'}
        </Button>
      )}
    </div>
  ));
};
