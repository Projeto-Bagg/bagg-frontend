import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { CountryFlag } from '@/components/ui/country-flag';
import { UserHoverCard } from '@/components/user-hovercard';
import { replaceByBold } from '@/utils/replaceByBold';
import Image from 'next/image';

interface TipSearchProps {
  tip: Tip;
  boldMessage?: string | null;
}

export const TipSearch = ({ tip, boldMessage }: TipSearchProps) => {
  return (
    <div className="border p-2">
      <div className="flex items-center mb-1 gap-2">
        <UserHoverCard username={tip.user.username}>
          <Avatar>
            <AvatarImage src={tip.user.image} />
          </Avatar>
        </UserHoverCard>
        <UserHoverCard username={tip.user.username}>
          <div className="flex flex-col">
            <span>{tip.user.fullName}</span>
            <span className="text-muted-foreground">@{tip.user.username}</span>
          </div>
        </UserHoverCard>
      </div>
      <div className="flex gap-1">
        <CountryFlag iso2={tip.city.region.country.iso2} />
        <span className="text-muted-foreground">{tip.city.name}</span>
      </div>
      <p
        dangerouslySetInnerHTML={{
          __html: boldMessage
            ? replaceByBold(tip.message, boldMessage.split(' '))
            : tip.message,
        }}
        className="line-clamp-3 mb-1"
      />
      {tip.tipMedias.slice(0, 2).map((media) => (
        <div className="relative w-1/4 aspect-square" key={media.id}>
          <Image src={media.url} alt="" fill />
        </div>
      ))}
    </div>
  );
};
