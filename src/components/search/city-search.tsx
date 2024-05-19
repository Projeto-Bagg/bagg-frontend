import { CountryFlag } from '@/components/ui/country-flag';

interface CitySearch {
  city: CityFromSearch;
}

export const CitySearch = ({ city }: CitySearch) => {
  return (
    <div className="flex items-center gap-2 bg-primary-foreground hover:bg-secondary rounded-lg transition-all">
      <CountryFlag
        className="h-[40px] w-[53.3px] rounded-lg shrink-0"
        iso2={city.iso2}
        tooltip={city.country}
      />
      <div className="flex-1 min-w-0 pr-1">
        <div className=" truncate">
          <span className="mr-1">{city.name}</span>
          <span className="text-sm text-muted-foreground">{city.region}</span>
        </div>
      </div>
    </div>
  );
};
