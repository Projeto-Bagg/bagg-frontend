'use client';

import { LatLngExpression } from 'leaflet';
import React from 'react';
import { Marker, MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css';
import 'leaflet-defaulticon-compatibility';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';

interface MapProps extends React.ComponentProps<typeof MapContainer> {
  LatLng: LatLngExpression;
}

export const Map = ({ LatLng, className, ...props }: MapProps) => {
  const { resolvedTheme } = useTheme();

  return (
    <MapContainer
      center={LatLng}
      zoom={8}
      className={cn('w-full aspect-square rounded-lg border-2', className)}
      scrollWheelZoom={false}
      dragging={false}
      {...props}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url={
          resolvedTheme === 'light'
            ? 'https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png'
            : 'https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png'
        }
      />
      <Marker position={LatLng} />
    </MapContainer>
  );
};
