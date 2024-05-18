import { Link } from '@/common/navigation';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { CountryFlag } from '@/components/ui/country-flag';
import { UserHoverCard } from '@/components/user-hovercard';
import { replaceByBold } from '@/utils/replace-by-bold';

interface TipSearchProps {
  tip: Tip;
  boldMessage?: string | null;
  setOpen: React.Dispatch<React.SetStateAction<boolean | undefined>>;
}

export const TipSearch = ({ tip, boldMessage, setOpen }: TipSearchProps) => {
  return (
    <div className="border rounded-sm p-2">
      <div className="flex items-center mb-1 gap-2">
        <UserHoverCard username={tip.user.username}>
          <Link href={{ params: { slug: tip.user.username }, pathname: '/[slug]' }}>
            <Avatar>
              <AvatarImage src={tip.user.image} />
            </Avatar>
          </Link>
        </UserHoverCard>
        <UserHoverCard username={tip.user.username}>
          <div className="flex flex-col">
            <Link
              className="hover:underline"
              href={{ params: { slug: tip.user.username }, pathname: '/[slug]' }}
            >
              <span>{tip.user.fullName}</span>
            </Link>
            <Link
              className="hover:underline text-muted-foreground"
              href={{ params: { slug: tip.user.username }, pathname: '/[slug]' }}
            >
              <span>@{tip.user.username}</span>
            </Link>
          </div>
        </UserHoverCard>
      </div>
      <div className="flex gap-1">
        <Link
          href={{ params: { slug: tip.city.id }, pathname: '/city/[slug]' }}
          className="hover:underline text-muted-foreground text-ellipsis min-w-0 whitespace-nowrap overflow-hidden"
        >
          {tip.city.name}, {tip.city.region.name}, {tip.city.region.country.name}
        </Link>
        <CountryFlag className="shrink-0" iso2={tip.city.region.country.iso2} />
      </div>
      <Link
        onClick={() => setOpen(false)}
        href={{ params: { slug: tip.id }, pathname: '/tip/[slug]' }}
      >
        <p
          dangerouslySetInnerHTML={{
            __html: boldMessage
              ? replaceByBold(tip.message, boldMessage.split(' '))
              : tip.message,
          }}
          className="line-clamp-3 mb-1"
        />
      </Link>
      {tip.tipMedias.slice(0, 2).map((media) => (
        <div className="relative w-1/4 aspect-square" key={media.id}>
          <img src={media.url} alt="" />
        </div>
      ))}
    </div>
  );
};
