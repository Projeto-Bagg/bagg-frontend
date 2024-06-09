import { Link } from '@/common/navigation';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { UserHoverCard } from '@/components/user-hovercard';

interface UserSearchProps {
  user: User;
  onClick?: () => any;
}

export const UserSearch = ({ user, onClick }: UserSearchProps) => {
  return (
    <Link
      key={user.id}
      className="block"
      href={{
        params: { slug: user.username },
        pathname: '/[slug]',
      }}
      onClick={onClick}
    >
      <div className="flex gap-2 items-center bg-primary-foreground hover:bg-secondary rounded-lg transition-all">
        <UserHoverCard username={user.username}>
          <Avatar className="rounded-lg h-[40px] w-[53.3px] bg-muted shadow-none">
            <AvatarImage className="object-cover" src={user.image} />
          </Avatar>
        </UserHoverCard>
        <div className="flex flex-1 min-w-0 items-center gap-1 pr-2">
          <UserHoverCard username={user.username}>
            <span className="font-medium truncate">{user.fullName}</span>
          </UserHoverCard>
          <UserHoverCard username={user.username}>
            <span className="text-sm shrink-0 text-muted-foreground whitespace-nowrap">
              @{user.username}
            </span>
          </UserHoverCard>
        </div>
      </div>
    </Link>
  );
};
