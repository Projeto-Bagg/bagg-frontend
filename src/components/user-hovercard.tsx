import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
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
import React, { ReactNode } from 'react';

interface UserHoverCardProps {
  user: User;
  children: ReactNode;
}

export default function UserHoverCard({ user, children }: UserHoverCardProps) {
  // const auth = useAuth();
  // const follow = useFollow();
  // const unfollow = useUnfollow();

  // const friendshipStatus = useQuery({
  //   queryKey: ['friendshipStatus', user.username],
  //   queryFn: async () =>
  //     (await axios.get('/users/friendshipStatus/' + user.username)).data,
  // });

  return (
    <HoverCard>
      <HoverCardTrigger>{children}</HoverCardTrigger>
      <HoverCardContent>
        <div className="flex justify-between items-center">
          <Avatar className="w-[3rem] h-[3rem]">
            <AvatarImage src={user.image} />
          </Avatar>
          {/* {user.id !== auth.user?.id && friendshipStatus.data && (
            <Button
              size={'sm'}
              onClick={() => {
                friendshipStatus.data.isFollowing
                  ? unfollow.mutate(user.username)
                  : follow.mutate(user.username);
              }}
            >
              {friendshipStatus.data.isFollowing ? 'Seguindo' : 'Seguir'}
            </Button>
          )} */}
        </div>
        <div className="mt-2 gap-1 flex-col flex">
          <div className="flex gap-2 items-baseline">
            <span className="font-bold">{user.username}</span>
            <span className="text-sm text-muted-foreground">{user.fullName}</span>
          </div>
          {user.bio && <span className="text-xs">{user.bio}</span>}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
