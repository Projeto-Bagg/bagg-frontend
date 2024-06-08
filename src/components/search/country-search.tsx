import { Link } from '@/common/navigation';
import { CountryFlag } from '@/components/ui/country-flag';

interface CountrySearchInterface {
  country: Country;
  onClick?: () => void;
}

export const CountrySearch = ({ country, onClick }: CountrySearchInterface) => {
  return (
    <Link
      onClick={onClick}
      className="block"
      href={{
        params: { slug: country.iso2 },
        pathname: '/country/[slug]',
      }}
    >
      <div className="flex items-center gap-2 bg-primary-foreground hover:bg-secondary rounded-lg transition-all">
        <CountryFlag
          className="h-[40px] w-[53.3px] rounded-lg"
          iso2={country.iso2}
          tooltip={country.name}
        />
        <span>{country.name}</span>
      </div>
    </Link>
  );
};
