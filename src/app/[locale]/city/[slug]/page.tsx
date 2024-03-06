'use client';

import { useCreateCityInterest } from '@/hooks/useCreateCityInterest';
import axios from '@/services/axios';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { CheckCircle, MapPin, XCircle } from 'lucide-react';
import { useDeleteCityInterest } from '@/hooks/useDeleteCityInterest';
import { CountryFlag } from '@/components/ui/country-flag';
import { LazyMap, LazyMarker, LazyTileLayer } from '@/components/leaflet-map';
import { Link } from '@/common/navigation';
import { CityVisits } from '@/components/city-visits';
import { Carousel } from 'react-responsive-carousel';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Rating } from '@smastrom/react-rating';
import { useCreateCityVisit } from '@/hooks/useCreateCityVisit';
import { useUpdateCityVisit } from '@/hooks/useUpdateCityVisit';
import { cn } from '@/lib/utils';
import { CreateCityVisit } from '@/components/create-city-visit';
import { useDeleteCityVisit } from '@/hooks/useDeleteCityVisit';
import { toast } from '@/components/ui/use-toast';

export default function Page({ params }: { params: { slug: string; id: string } }) {
  const createCityInterest = useCreateCityInterest();
  const deleteCityInterest = useDeleteCityInterest();
  const createCityVisit = useCreateCityVisit();
  const updateCityVisit = useUpdateCityVisit();
  const deleteCityVisit = useDeleteCityVisit();
  const t = useTranslations('cityPage');

  const city = useQuery<CityPage>({
    queryFn: async () => (await axios.get<CityPage>('/cities/' + params.slug)).data,
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

  const checkVisit = async () => {
    if (city.data.userVisit) {
      await deleteCityVisit.mutateAsync({ cityId: city.data.id });
      return;
    }

    await createCityVisit.mutateAsync({ cityId: city.data.id });
  };

  const onRate = async (value: number) => {
    if (city.data.userVisit) {
      await updateCityVisit.mutateAsync({ rating: value, cityId: city.data.id });
      return;
    }

    await createCityVisit.mutateAsync({ rating: value, cityId: city.data.id });
  };

  return (
    <div className="px-4 pb-4 sm:px-11 relative">
      <CountryFlag
        className="w-full left-0 right-0 m-auto absolute -z-10 gradient-mask-b-[rgba(0,0,0,1.0)_4px] rounded-none"
        iso2={city.data.region.country.iso2}
      />
      <div className="flex flex-col gap-6 sm:flex-row pt-[200px] sm:pt-[440px] justify-between pb-[24px]">
        <div>
          <h2 className="font-bold text-3xl sm:text-5xl">{city.data.name}</h2>
          <div className="font-bold text-lg sm:text-2xl text-muted-foreground">
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
          <div className="flex items-center gap-2 text-muted-foreground">
            <div>
              <Rating
                value={city.data.averageRating}
                readOnly
                className="max-w-[120px] sm:max-w-[144px]"
              />
            </div>
            <span>{city.data.averageRating}</span>
            <div className="text-sm flex gap-2 items-center">
              <div className="flex items-center gap-0.5">
                <MapPin className="w-[18px] text-blue-400" />
                <span>{city.data.visitsCount}</span>
              </div>
              <div className="flex items-center gap-0.5">
                <CheckCircle className="w-[18px] text-green-400" />
                <span>{city.data.interestsCount}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col font-semibold text-sm bg-accent rounded-lg w-full sm:w-[200px] space-y-1 divide-y-2 divide-background">
          <div className="flex justify-center gap-4 py-3">
            <button onClick={checkVisit} className="flex flex-col gap-1 items-center">
              <MapPin
                strokeWidth={2.5}
                className={cn(
                  'w-[24px] h-[24px]',
                  city.data.userVisit && 'text-blue-400',
                )}
              />
              <span>{t('visited')}</span>
            </button>
            <button className="flex flex-col gap-1 items-center" onClick={checkInterest}>
              <div>
                <CheckCircle
                  className={cn(
                    'w-[24px] h-[24px]',
                    city.data.isInterested && 'text-green-400',
                  )}
                  strokeWidth={2.5}
                />
              </div>
              <span>{city.data.isInterested ? t('interested') : t('interest')}</span>
            </button>
          </div>
          <div className="flex flex-col items-center py-3">
            <span>{t('rate')}</span>
            <Rating
              className="max-w-[120px]"
              value={
                city.data.userVisit
                  ? city.data.userVisit.rating
                    ? city.data.userVisit.rating
                    : 0
                  : 0
              }
              onChange={onRate}
            />
          </div>
          <CreateCityVisit city={city.data}>
            <div className="flex justify-center py-3">
              <span>{t('review')}</span>
            </div>
          </CreateCityVisit>
        </div>
      </div>
      <div className="grid gap-x-4 gap-y-6 grid-cols-1 sm:grid-cols-2">
        <div>
          <div className="mb-2">
            <span className="uppercase">{t('gallery')}</span>
          </div>
          <div className="border-2 rounded-lg aspect-square">
            {city.data.images.length > 0 ? (
              <Carousel emulateTouch showIndicators={false} showStatus={false}>
                {city.data.images.map((media) => (
                  <div key={media.id}>
                    {media.url.endsWith('mp4') ? (
                      <div
                        key={media.id}
                        className="h-full flex justify-center items-center bg-black rounded-lg"
                      >
                        <video controls src={media.url} />
                      </div>
                    ) : (
                      <Image
                        src={media.url}
                        alt=""
                        height={532}
                        width={532}
                        className="h-full rounded-lg aspect-square object-cover"
                      />
                    )}
                  </div>
                ))}
              </Carousel>
            ) : (
              <div className="justify-center flex h-full w-full items-center font-bold">
                <span>{t('noImages')}</span>
              </div>
            )}
          </div>
        </div>
        <div>
          <div className="mb-2">
            <span className="uppercase">{t('location')}</span>
          </div>
          <LazyMap
            center={[city.data.latitude, city.data.longitude]}
            zoom={8}
            className="w-full aspect-square rounded-lg border-2"
            scrollWheelZoom={false}
            dragging={false}
          >
            <LazyTileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
            />
            <LazyMarker position={[city.data.latitude, city.data.longitude]} />
          </LazyMap>
        </div>
        <div className="sm:col-span-2">
          <CityVisits visits={city.data.visits} />
        </div>
      </div>
    </div>
  );
}
