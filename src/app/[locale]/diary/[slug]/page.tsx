'use client';

import React from 'react';
import { DiaryPost } from '@/components/diary-post';
import { useOriginTracker } from '@/context/origin-tracker';
import axios from '@/services/axios';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, MoreHorizontal } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { Separator } from '@/components/ui/separator';
import {
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';

import { useToast } from '@/components/ui/use-toast';
import { useDeleteTripDiary } from '@/hooks/useDeleteTripDiary';
import { useAuth } from '@/context/auth-context';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { intlFormatDistance } from 'date-fns';

export default function Page({ params }: { params: { slug: string } }) {
  const isWithinPage = useOriginTracker();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations();
  const { toast } = useToast();
  const auth = useAuth();
  const deleteTripDiary = useDeleteTripDiary();

  const tripDiary = useQuery<TripDiary>({
    queryKey: ['tripDiary', params.slug],
    queryFn: async () => (await axios.get<TripDiary>('tripDiaries/' + params.slug)).data,
  });

  const tripDiaryPosts = useQuery<DiaryPost[]>({
    queryKey: ['tripDiaryPosts', +params.slug],
    queryFn: async () =>
      (await axios.get<DiaryPost[]>(`tripDiaries/${params.slug}/posts`)).data,
  });

  if (tripDiary.isError) {
    return (
      <div className="mt-4 flex w-full justify-center">
        <span>{t('tripDiary.notFound')}</span>
      </div>
    );
  }

  const handleShareClick = () => {
    if (!tripDiary.data) {
      return;
    }

    navigator.clipboard.writeText(window.location.origin + '/diary/' + tripDiary.data.id);

    toast({ title: 'Link copiado para a área de transferência' });
  };

  const handleDeleteClick = async () => {
    if (!tripDiary.data) {
      return;
    }

    await deleteTripDiary.mutateAsync(tripDiary.data.id).then(() => {
      router.push('/' + tripDiary.data.user.username);
    });
  };

  return (
    <div>
      <div className="flex pt-4 sm:px-11 items-start">
        <div
          onClick={() => (isWithinPage ? router.back() : router.push('/'))}
          className="flex mr-6 items-center justify-center rounded-full w-8 h-8 cursor-pointer"
        >
          <ArrowLeft strokeWidth={3} size={20} />
        </div>
        {tripDiary.data && (
          <div className="flex flex-col w-full">
            <div className="flex justify-between items-center w-full">
              <span className="font-bold">{tripDiary.data.title}</span>
              <div className="flex gap-1 items-center text-muted-foreground">
                <span className="text-sm">
                  {intlFormatDistance(tripDiary.data.createdAt, new Date(), {
                    numeric: 'always',
                    style: 'narrow',
                    locale,
                  })}
                </span>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <div className="hover:bg-primary-foreground p-1.5 [&>svg]:hover:text-primary transition-all rounded-full">
                      <MoreHorizontal size={20} className="transition-all" />
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onSelect={handleShareClick}>
                      {t('tripDiary.copyLink')}
                    </DropdownMenuItem>
                    {auth.user?.id === tripDiary.data.user.id && (
                      <>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem
                              onSelect={(e) => e.preventDefault()}
                              className="font-bold"
                            >
                              {t('tripDiary.delete')}
                            </DropdownMenuItem>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                {t('tripDiary.deleteModal.title')}
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                {t('tripDiary.deleteModal.description')}
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>
                                {t('diaryPost.deleteModal.cancel')}
                              </AlertDialogCancel>
                              <AlertDialogAction onClick={handleDeleteClick}>
                                {t('diaryPost.deleteModal.action')}
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
            <span className="text-muted-foreground">{tripDiary.data.message}</span>
            {tripDiary.data && (
              <span className="text-muted-foreground text-sm">
                {t('tripDiary.posts', { count: tripDiaryPosts.data?.length })}
              </span>
            )}
          </div>
        )}
      </div>
      <Separator className="mt-4" />
      {tripDiaryPosts.data &&
        tripDiaryPosts.data.map((post) => <DiaryPost key={post.id} post={post} />)}
    </div>
  );
}
