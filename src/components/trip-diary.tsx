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
import { useDeleteTripDiary } from '@/hooks/useDeleteTripDiary';
import { useAuth } from '@/context/auth-context';

interface TripDiaryProps {
  tripDiary: TripDiary;
  seePostsAnchor?: boolean;
}

export default function TripDiary({ tripDiary, seePostsAnchor }: TripDiaryProps) {
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

    toast({ title: 'Link copiado para a área de transferência' });
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
    <div className="sm:m-4 p-4 sm:px-7 border-b sm:border sm:border-border sm:rounded-lg">
      <div className="flex flex-col w-full">
        <div className="flex justify-between items-center w-full">
          <div>
            <span className="font-bold">{tripDiary.title}</span>
            <div className="flex gap-1 text-sm text-muted-foreground">
              <span>
                {tripDiary.city.name}, {tripDiary.city.region.name},{' '}
                {tripDiary.city.region.country.name}
              </span>
              <CountryFlag className="ml-1" iso2={tripDiary.city.region.country.iso2} />
            </div>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-muted-foreground text-sm">
              {formatter.relativeTime(tripDiary.createdAt, new Date())}
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <div className="hover:bg-primary-foreground p-1.5 [&>svg]:hover:text-primary transition-all rounded-full">
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
              className="text-primary text-sm"
            >
              {t('trip-diary.see-posts-anchor')}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
