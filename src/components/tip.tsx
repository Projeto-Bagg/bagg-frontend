'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { DiaryLikedByList } from '@/components/diary-liked-by-list';
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
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/auth-context';
import { Heart, MoreHorizontal } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { Carousel } from 'react-responsive-carousel';
import { intlFormatDistance } from 'date-fns';
import { UserHoverCard } from '@/components/user-hovercard';
import { useLikeTip } from '@/hooks/useLikeTip';
import { useUnlikeTip } from '@/hooks/useUnlikeTip';
import { useDeleteTip } from '@/hooks/useDeleteTip';
import { TipLikedByList } from '@/components/tip-liked-by-list';
import { CountryFlag } from '@/components/ui/country-flag';

export const Tip = ({ tip }: { tip: Tip }) => {
  const { toast } = useToast();
  const auth = useAuth();
  const locale = useLocale();
  const like = useLikeTip();
  const unlike = useUnlikeTip();
  const deleteTip = useDeleteTip();
  const router = useRouter();
  const t = useTranslations();

  const handleLikeClick = () => {
    if (!auth.user) {
      return router.push('/login');
    }

    if (tip.isLiked) {
      return unlike.mutate(tip);
    }
    return like.mutate(tip);
  };

  const handleShareClick = () => {
    navigator.clipboard.writeText(window.location.origin + '/tip/' + tip.id);

    toast({ title: 'Link copiado para a área de transferência' });
  };

  const handleDeleteClick = () => {
    deleteTip.mutate(tip.id);
  };

  return (
    <article className="sm:m-4 px-4 py-6 sm:px-7 space-y-3 border-b sm:border sm:border-border sm:rounded-lg">
      <div className="flex">
        <div className="basis-[40px] mr-3">
          <UserHoverCard username={tip.user.username}>
            <Link href={'/' + tip.user.username} className="h-fit">
              <Avatar className="h-[44px] w-[44px] shrink-0">
                <AvatarImage src={tip.user.image} />
              </Avatar>
            </Link>
          </UserHoverCard>
        </div>
        <div className="grow basis-0">
          <div className="flex gap-2 items-start justify-between">
            <div className="inline-block overflow-hidden text-ellipsis whitespace-nowrap ">
              <div className="flex flex-col">
                <Link href={'/' + tip.user.username}>
                  <span>{tip.user.fullName}</span>
                </Link>
                <Link href={'/' + tip.user.username} className="text-muted-foreground">
                  <span className="text-sm">@{tip.user.username}</span>
                </Link>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2 text-muted-foreground">
              <TipLikedByList id={tip.id}>
                <span className="text-sm">{tip.likedBy}</span>
              </TipLikedByList>
              <Heart
                onClick={handleLikeClick}
                data-liked={tip.isLiked}
                size={20}
                className="data-[liked=true]:fill-red-600 data-[liked=true]:text-red-600 cursor-pointer text-foreground"
              />
              <span className="text-sm">
                {intlFormatDistance(tip.createdAt, new Date(), {
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
                    {t('tip.copyLink')}
                  </DropdownMenuItem>
                  {auth.user?.id === tip.user.id && (
                    <>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <DropdownMenuItem
                            onSelect={(e) => e.preventDefault()}
                            className="font-bold"
                          >
                            {t('tip.delete')}
                          </DropdownMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              {t('tip.deleteModal.title')}
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              {t('tip.deleteModal.description')}
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>
                              {t('tip.deleteModal.cancel')}
                            </AlertDialogCancel>
                            <AlertDialogAction onClick={handleDeleteClick}>
                              {t('tip.deleteModal.action')}
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
          <div className="flex items-center gap-2 my-2">
            <Badge className="bg-orange-400 hover:bg-orange-500 uppercase">
              {t('tip.badge')}
            </Badge>
            <Link
              className="text-muted-foreground hover:underline"
              href={'/city/' + tip.city.id}
            >
              <div className="flex gap-2">
                <span>
                  {tip.city.name}, {tip.city.region.name}, {tip.city.region.country.name}
                </span>
                <CountryFlag iso2={tip.city.region.country.iso2} />
              </div>
            </Link>
          </div>
          <div>
            <p className="text-sm sm:text-base">{tip.message}</p>
          </div>
          {tip.tipMedias.length !== 0 && (
            <div className="mt-2">
              {tip.tipMedias.length === 1 && (
                <div className="relative aspect-square max-w-[752px] max-h-[423px]">
                  {tip.tipMedias[0].url.endsWith('mp4') ? (
                    <div
                      key={tip.tipMedias[0].id}
                      className="h-full flex justify-center items-center bg-black rounded-lg"
                    >
                      <video controls src={tip.tipMedias[0].url} />
                    </div>
                  ) : (
                    <Image
                      src={tip.tipMedias[0].url}
                      alt=""
                      fill
                      className="h-full w-full rounded-lg aspect-square object-cover"
                    />
                  )}
                </div>
              )}
              {tip.tipMedias.length === 2 && (
                <div className="grid aspect-[16/9] grid-cols-[minmax(0px,_75fr)_minmax(0px,_75fr)] grid-rows-[100%] w-full">
                  {tip.tipMedias.map((media) =>
                    media.url.endsWith('mp4') ? (
                      <div
                        key={media.id}
                        className="h-full flex justify-center items-center bg-black rounded-lg"
                      >
                        <video controls src={media.url} />
                      </div>
                    ) : (
                      <div key={media.id} className="relative mr-1">
                        <Image
                          src={media.url}
                          alt=""
                          fill
                          className="h-full rounded-lg object-cover"
                        />
                      </div>
                    ),
                  )}
                </div>
              )}
              {tip.tipMedias.length > 2 && (
                <Carousel
                  centerMode
                  centerSlidePercentage={45}
                  emulateTouch
                  showIndicators={false}
                  showStatus={false}
                >
                  {tip.tipMedias.map((media) => (
                    <div key={media.id} className="mr-1">
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
              )}
            </div>
          )}
        </div>
      </div>
    </article>
  );
};
