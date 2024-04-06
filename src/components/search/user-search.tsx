import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { UserHoverCard } from '@/components/user-hovercard';
import React from 'react';

interface UserSearchProps {
  user: User;
}

export const UserSearch = ({ user }: UserSearchProps) => {
  return (
    <div className="flex gap-2 bg-primary-foreground hover:bg-secondary rounded-lg transition-all">
      <UserHoverCard username={user.username}>
        <Avatar className="rounded-sm bg-muted">
          <AvatarImage src={user.image} />
        </Avatar>
      </UserHoverCard>
      <div className="flex items-center gap-1">
        <UserHoverCard username={user.username}>
          <span className="font-medium">{user.fullName}</span>
        </UserHoverCard>
        <UserHoverCard username={user.username}>
          <span className="text-sm text-muted-foreground">@{user.username}</span>
        </UserHoverCard>
      </div>
    </div>
  );
};
