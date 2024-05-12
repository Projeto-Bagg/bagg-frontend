import { LatLngExpression } from 'leaflet';
import React from 'react';
import { Marker, MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css'; // Re-uses images from ~leaflet package
import 'leaflet-defaulticon-compatibility';
import { cn } from '@/lib/utils';

interface MapProps extends React.ComponentProps<typeof MapContainer> {
  LatLng: LatLngExpression;
}

export const Map = ({ LatLng, className, ...props }: MapProps) => {
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
        url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
      />
      <Marker position={LatLng} />
    </MapContainer>
  );
};
