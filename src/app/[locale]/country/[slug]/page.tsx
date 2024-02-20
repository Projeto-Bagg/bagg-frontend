'use client';

import { LazyMap, LazyMarker, LazyTileLayer } from '@/components/leaflet-map';
import { CountryFlag } from '@/components/ui/country-flag';
import axios from '@/services/axios';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

export default function Page({ params }: { params: { slug: string; id: string } }) {
  const country = useQuery<Country>({
    queryFn: async () => (await axios.get<Country>('/countries/' + params.slug)).data,
    queryKey: ['country', params.slug],
  });

  if (!country.data) {
    return;
  }

  return (
    <div className="px-4 md:px-11 relative">
      <CountryFlag
        className="w-full left-0 right-0 m-auto absolute -z-10 gradient-mask-b-[rgba(0,0,0,1.0)_4px]"
        iso2={country.data.iso2}
      />
      <div className="flex pt-[200px] md:pt-[480px] justify-between items-center pb-[40px] md:pb-[120px]">
        <div>
          <h2 className="font-bold text-5xl">{country.data.name}</h2>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div>somthing</div>
        <LazyMap
          center={[country.data.latitude, country.data.longitude]}
          zoom={5}
          className="w-full aspect-square rounded-lg"
          scrollWheelZoom={false}
          dragging={false}
          zoomControl={false}
        >
          <LazyTileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
          />
          <LazyMarker position={[country.data.latitude, country.data.longitude]} />
        </LazyMap>
      </div>
    </div>
  );
}
