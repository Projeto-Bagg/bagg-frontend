'use client';

import { useCreateCityInterest } from '@/hooks/useCreateCityInterest';
import axios from '@/services/axios';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { useDeleteCityInterest } from '@/hooks/useDeleteCityInterest';
import { CountryFlag } from '@/components/ui/country-flag';
import { LazyMap, LazyMarker, LazyTileLayer } from '@/components/leaflet-map';
import { Link } from '@/common/navigation';
import { CityVisits } from '@/components/city-visits';

export default function Page({ params }: { params: { slug: string; id: string } }) {
  const createCityInterest = useCreateCityInterest();
  const deleteCityInterest = useDeleteCityInterest();

  const city = useQuery<City>({
    queryFn: async () => (await axios.get<City>('/cities/' + params.slug)).data,
    queryKey: ['city', +params.slug],
  });

  if (!city.data) {
    return;
  }

  const checkInterest = () => {
    if (city.data.isInterested) {
      return deleteCityInterest.mutateAsync(city.data.id);
    }

    createCityInterest.mutateAsync(city.data.id);
  };

  return (
    <div className="px-4 pb-4 md:px-11 relative">
      <CountryFlag
        className="w-full left-0 right-0 m-auto absolute -z-10 gradient-mask-b-[rgba(0,0,0,1.0)_4px] rounded-none"
        iso2={city.data.region.country.iso2}
      />
      <div className="flex pt-[200px] md:pt-[480px] justify-between items-center pb-[40px] md:pb-[120px]">
        <div>
          <h2 className="font-bold text-5xl">{city.data.name}</h2>
          <div className="font-bold text-2xl text-muted-foreground">
            <span>
              {city.data.region.name}
              {', '}
            </span>
            <Link
              href={{
                params: { slug: city.data.region.country.iso2 },
                pathname: '/country/[slug]',
              }}
            >
              {city.data.region.country.name}
            </Link>
          </div>
        </div>
        <div>
          <button className="flex flex-col items-center" onClick={checkInterest}>
            <div>
              {city.data.isInterested ? (
                <XCircle strokeWidth={2.5} />
              ) : (
                <CheckCircle strokeWidth={2.5} />
              )}
            </div>
            <span className="font-semibold">
              {city.data.isInterested ? 'Desmarcar interesse' : 'Marcar interesse'}
            </span>
          </button>
        </div>
      </div>
      <div className="grid gap-x-2 gap-y-6 grid-cols-1 md:grid-cols-2">
        <div>somthing</div>
        <LazyMap
          center={[city.data.latitude, city.data.longitude]}
          zoom={8}
          className="w-full aspect-square rounded-lg"
          scrollWheelZoom={false}
          dragging={false}
        >
          <LazyTileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
          />
          <LazyMarker position={[city.data.latitude, city.data.longitude]} />
        </LazyMap>
        <div className="md:col-span-2">
          <CityVisits visits={city.data.visits} />
        </div>
      </div>
    </div>
  );
}
