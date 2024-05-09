import { CountryFlag } from '@/components/ui/country-flag';

interface CountrySearchInterface {
  country: Country;
}

export const CountrySearch = ({ country }: CountrySearchInterface) => {
  return (
    <div className="flex items-center gap-2 bg-primary-foreground hover:bg-secondary rounded-lg transition-all">
      <CountryFlag
        className="h-[40px] w-[53.3px] rounded-lg"
        iso2={country.iso2}
        tooltip={country.name}
      />
      <span>{country.name}</span>
    </div>
  );
};
