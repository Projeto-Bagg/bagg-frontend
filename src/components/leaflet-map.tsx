import dynamic from 'next/dynamic';

import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css'; // Re-uses images from ~leaflet package
import 'leaflet-defaulticon-compatibility';

export const LazyMap = dynamic(async () => (await import('react-leaflet')).MapContainer, {
  ssr: false,
});

export const LazyMarker = dynamic(async () => (await import('react-leaflet')).Marker, {
  ssr: false,
});

export const LazyMarkerCluster = dynamic(
  async () => (await import('react-leaflet')).Marker,
  {
    ssr: false,
  },
);

export const LazyTileLayer = dynamic(
  async () => (await import('react-leaflet')).TileLayer,
  {
    ssr: false,
  },
);

export const LazyPopup = dynamic(async () => (await import('react-leaflet')).Popup, {
  ssr: false,
});
