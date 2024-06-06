'use client';

import React from 'react';
import { CountryFlag } from '@/components/ui/country-flag';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Link, useRouter } from '@/common/navigation';
import { useFormatter, useTranslations } from 'next-intl';
import { toast } from '@/components/ui/use-toast';
import { useDeleteTripDiary } from '@/hooks/trip-diary';
import { useAuth } from '@/context/auth-context';

interface TripDiaryProps {
  tripDiary: TripDiary;
  seePostsAnchor?: boolean;
}

export const TripDiary = ({ tripDiary, seePostsAnchor }: TripDiaryProps) => {
  const formatter = useFormatter();
  const t = useTranslations();
  const deleteTripDiary = useDeleteTripDiary();
  const router = useRouter();
  const auth = useAuth();

  const handleShareClick = () => {
    if (!tripDiary) {
      return;
    }

    navigator.clipboard.writeText(window.location.origin + '/diary/' + tripDiary.id);

    toast({ title: t('commons.copy-link'), variant: 'success' });
  };

  const handleDeleteClick = async () => {
    if (!tripDiary) {
      return;
    }

    await deleteTripDiary.mutateAsync(tripDiary.id).then(() => {
      router.push({ params: { slug: auth.user!.username }, pathname: '/[slug]/diaries' });
    });
  };

  return (
    <div className="py-4 border-b">
      <div className="flex flex-col w-full">
        <div className="flex justify-between items-center w-full">
          <Link
            className="font-bold hover:underline"
            href={{ params: { slug: tripDiary.id }, pathname: '/diary/[slug]' }}
          >
            {tripDiary.title}
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-sm">
              {formatter.relativeTime(tripDiary.createdAt, new Date())}
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <div className="hover:bg-primary-foreground p-1.5 [&>svg]:hover:text-primary text-muted-foreground transition-all rounded-full">
                  <MoreHorizontal size={20} className="transition-all" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onSelect={handleShareClick}>
                  {t('trip-diary.copy-link')}
                </DropdownMenuItem>
                {auth.user?.id === tripDiary.user.id && (
                  <>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <DropdownMenuItem
                          onSelect={(e) => e.preventDefault()}
                          className="font-bold"
                        >
                          {t('trip-diary.delete')}
                        </DropdownMenuItem>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            {t('trip-diary.delete-modal.title')}
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            {t('trip-diary.delete-modal.description')}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>
                            {t('diary-post.delete-modal.cancel')}
                          </AlertDialogCancel>
                          <AlertDialogAction onClick={handleDeleteClick}>
                            {t('diary-post.delete-modal.action')}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="flex gap-2 text-sm text-muted-foreground">
          <Link
            href={{ params: { slug: tripDiary.city.id }, pathname: '/city/[slug]' }}
            className="hover:underline"
          >
            {tripDiary.city.name}, {tripDiary.city.region.name},{' '}
            {tripDiary.city.region.country.name}
          </Link>
          <CountryFlag className="ml-1" iso2={tripDiary.city.region.country.iso2} />
        </div>
        <span className="text-muted-foreground text-sm">
          {t('trip-diary.posts', {
            count: tripDiary.postsAmount,
          })}
        </span>
        <span className="text-sm pt-1">{tripDiary.message}</span>
        {seePostsAnchor && (
          <div className="mt-1">
            <Link
              href={{ params: { slug: tripDiary.id }, pathname: '/diary/[slug]' }}
              key={tripDiary.id}
              className="text-primary text-sm hover:underline"
            >
              {t('trip-diary.see-posts-anchor')}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
