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
import { useDeleteDiaryPost } from '@/hooks/useDeleteDiaryPost';
import { useLikeDiaryPost } from '@/hooks/useLikeDiaryPost';
import { useUnlikeDiaryPost } from '@/hooks/useUnlikeDiaryPost';
import { Heart, MoreHorizontal } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { intlFormatDistance } from 'date-fns';

export const DiaryPost = ({ post }: { post: DiaryPost }) => {
  const { toast } = useToast();
  const auth = useAuth();
  const locale = useLocale();
  const like = useLikeDiaryPost();
  const unlike = useUnlikeDiaryPost();
  const deletePost = useDeleteDiaryPost();
  const router = useRouter();
  const t = useTranslations();

  const handleLikeClick = () => {
    if (!auth.user) {
      return router.push('/login');
    }

    if (post.isLiked) {
      return unlike.mutate(post);
    }
    return like.mutate(post);
  };

  const handleShareClick = () => {
    navigator.clipboard.writeText(window.location.origin + '/diary/post/' + post.id);

    toast({ title: 'Link copiado para a área de transferência' });
  };

  const handleDeleteClick = () => {
    deletePost.mutate(post.id);
  };

  return (
    <article className="md:m-4 p-4 md:px-7 space-y-3 border-b md:border md:border-border md:rounded-lg">
      <div className="flex">
        <div className="basis-[40px] mr-3">
          <Link href={'/' + post.user.username} className="h-fit">
            <Avatar className="h-[44px] w-[44px] shrink-0">
              <AvatarImage src={post.user.image} />
            </Avatar>
          </Link>
        </div>
        <div className="grow basis-0">
          <div className="flex gap-2 items-start justify-between">
            <Link
              className="inline-block overflow-hidden text-ellipsis whitespace-nowrap"
              href={'/' + post.user.username}
            >
              <div className="flex flex-col">
                <span>{post.user.fullName}</span>
                <span className="text-sm text-muted-foreground">
                  @{post.user.username}
                </span>
              </div>
            </Link>
            <div className="flex shrink-0 items-center gap-2 text-muted-foreground">
              <DiaryLikedByList id={post.id}>
                <span className="text-sm">{post.likedBy}</span>
              </DiaryLikedByList>
              <Heart
                onClick={handleLikeClick}
                data-liked={post.isLiked}
                size={20}
                className="data-[liked=true]:fill-red-600 data-[liked=true]:text-red-600 cursor-pointer text-foreground"
              />
              <span className="text-sm">
                {intlFormatDistance(post.createdAt, new Date(), {
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
                    {t('diaryPost.copyLink')}
                  </DropdownMenuItem>
                  {auth.user?.id === post.user.id && (
                    <>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <DropdownMenuItem
                            onSelect={(e) => e.preventDefault()}
                            className="font-bold"
                          >
                            {t('diaryPost.delete')}
                          </DropdownMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              {t('diaryPost.deleteModal.title')}
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              {t('diaryPost.deleteModal.description')}
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
          <Link href={'/diary/' + post.tripDiary.id}>
            <div className="flex gap-2 my-2">
              <Badge>{t('diaryPost.diaryBadge')}</Badge>
              <span className="text-muted-foreground text-sm">
                {post.tripDiary.title}
              </span>
            </div>
          </Link>
          <div className="mb-2">
            <p className="text-sm md:text-base">{post.message}</p>
          </div>
          <div>
            {post.diaryPostMedias.length === 1 && (
              <div className="relative aspect-square max-w-[752px] max-h-[423px]">
                {post.diaryPostMedias[0].url.endsWith('mp4') ? (
                  <div
                    key={post.diaryPostMedias[0].id}
                    className="h-full flex justify-center items-center bg-black rounded-lg"
                  >
                    <video controls src={post.diaryPostMedias[0].url} />
                  </div>
                ) : (
                  <Image
                    src={post.diaryPostMedias[0].url}
                    alt=""
                    fill
                    className="h-full w-full rounded-lg aspect-square object-cover"
                  />
                )}
              </div>
            )}
            {post.diaryPostMedias.length === 2 && (
              <div className="grid aspect-[16/9] grid-cols-[minmax(0px,_75fr)_minmax(0px,_75fr)] grid-rows-[100%] w-full">
                {post.diaryPostMedias.map((media) =>
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
            {post.diaryPostMedias.length > 2 && (
              <Carousel
                centerMode
                centerSlidePercentage={45}
                emulateTouch
                showIndicators={false}
                showStatus={false}
              >
                {post.diaryPostMedias.map((media) => (
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
        </div>
      </div>
    </article>
  );
};
