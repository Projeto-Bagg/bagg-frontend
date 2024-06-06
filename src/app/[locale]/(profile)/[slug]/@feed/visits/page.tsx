'use client';

import { Link } from '@/common/navigation';
import { Badge } from '@/components/ui/badge';
import { CollapsibleContent } from '@/components/ui/collapsible';
import { CountryFlag } from '@/components/ui/country-flag';
import axios from '@/services/axios';
import { Collapsible, CollapsibleTrigger } from '@radix-ui/react-collapsible';
import { Rating } from '@smastrom/react-rating';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { pt, enUS } from 'date-fns/locale';
import { useLocale, useTranslations } from 'next-intl';
import React from 'react';

export default function Visits({ params }: { params: { slug: string } }) {
  const locale = useLocale();
  const t = useTranslations();

  const visits = useQuery<UserCityVisit[]>({
    queryKey: ['user-visits', params.slug],
    queryFn: async () =>
      (await axios.get<UserCityVisit[]>(`/users/${params.slug}/visits`)).data,
  });

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-4 gap-x-2 w-full mt-4">
      {visits.data?.map((visit) => (
        <div key={visit.id} className="shadow h-fit p-2 pt-0 relative">
          <CountryFlag
            className="w-full left-0 right-0 absolute -z-10 gradient-mask-b-[rgba(0,0,0,1.0)_4px]"
            iso2={visit.city.region.country.iso2}
          />
          <Collapsible>
            <div className="w-full h-[220px] rounded-sm overflow-hidden relative">
              {visit.rating && visit.message && (
                <CollapsibleTrigger className="absolute top-1.5 right-0">
                  <Badge className="bg-green-500 hover:bg-green-400 border shadow text-muted uppercase">
                    {t('city-visit.badge')}
                  </Badge>
                </CollapsibleTrigger>
              )}

              <div className="absolute flex flex-col bottom-0">
                <Link
                  className="hover:underline"
                  href={{ params: { slug: visit.city.id }, pathname: '/city/[slug]' }}
                >
                  <span className="font-bold">{visit.city.name}</span>
                </Link>
                <span className="text-muted-foreground">{visit.city.region.name}</span>
                <span className="text-sm text-muted-foreground">
                  {format(visit.createdAt, 'PP', { locale: locale === 'pt' ? pt : enUS })}
                </span>
                <div className="flex gap-1 items-center">
                  <Rating readOnly value={visit.rating || 0} className="max-w-[84px]" />
                  <span className="font-bold">{visit.rating}</span>
                </div>
              </div>
            </div>
            <CollapsibleContent>
              <span className="text-sm">{visit.message}</span>
            </CollapsibleContent>
          </Collapsible>
        </div>
      ))}
    </div>
  );
}
