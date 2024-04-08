import { CountryFlag } from '@/components/ui/country-flag';
import React from 'react';

interface CitySearch {
  city: CityFromSearch;
}

export const CitySearch = ({ city }: CitySearch) => {
  return (
    <div className="flex items-center gap-2 bg-primary-foreground hover:bg-secondary rounded-lg transition-all">
      <CountryFlag
        className="h-[40px] w-[53.3px] rounded-lg"
        iso2={city.iso2}
        tooltip={city.country}
      />
      <div className="flex gap-1 items-baseline">
        <span>{city.name}</span>
        <span className="text-sm text-muted-foreground">{city.region}</span>
      </div>
    </div>
  );
};
