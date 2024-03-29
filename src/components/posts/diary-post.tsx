'use client';

import React, { HTMLProps, forwardRef } from 'react';
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
import { intlFormatDistance } from 'date-fns';
import { UserHoverCard } from '@/components/user-hovercard';
import { Medias } from '@/components/posts/medias';

export const DiaryPost = forwardRef<
  HTMLDivElement,
  HTMLProps<HTMLDivElement> & {
    post: DiaryPost;
  }
>(({ post, ...props }, forwardRef) => {
  const { toast } = useToast();
  const auth = useAuth();
  const locale = useLocale();
  const like = useLikeDiaryPost();
  const unlike = useUnlikeDiaryPost();
  const deletePost = useDeleteDiaryPost();
  const router = useRouter();
  const t = useTranslations();

  const handleLikeClick = async () => {
    if (!auth.user) {
      return router.push('/login');
    }

    if (post.isLiked) {
      return await unlike.mutateAsync(post);
    }
    return await like.mutateAsync(post);
  };

  const handleShareClick = () => {
    navigator.clipboard.writeText(window.location.origin + '/diary/post/' + post.id);

    toast({ title: 'Link copiado para a área de transferência' });
  };

  const handleDeleteClick = () => {
    deletePost.mutate(post.id);
  };

  return (
    <article {...props} ref={forwardRef} className="py-4 space-y-3 border-b">
      <div className="flex">
        <div className="basis-[40px] mr-3">
          <UserHoverCard username={post.user.username}>
            <Link href={'/' + post.user.username} className="h-fit">
              <Avatar className="h-[44px] w-[44px] shrink-0">
                <AvatarImage src={post.user.image} />
              </Avatar>
            </Link>
          </UserHoverCard>
        </div>
        <div className="grow basis-0">
          <div className="flex gap-2 items-start justify-between">
            <div className="inline-block overflow-hidden text-ellipsis whitespace-nowrap">
              <UserHoverCard username={post.user.username}>
                <div className="flex flex-col">
                  <Link href={'/' + post.user.username}>
                    <span>{post.user.fullName}</span>
                  </Link>
                  <Link href={'/' + post.user.username} className="text-muted-foreground">
                    <span className="text-sm">@{post.user.username}</span>
                  </Link>
                </div>
              </UserHoverCard>
            </div>
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
                    {t('diary-post.copy-link')}
                  </DropdownMenuItem>
                  {auth.user?.id === post.user.id && (
                    <>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <DropdownMenuItem
                            onSelect={(e) => e.preventDefault()}
                            className="font-bold"
                          >
                            {t('diary-post.delete')}
                          </DropdownMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              {t('diary-post.delete-modal.title')}
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              {t('diary-post.delete-modal.description')}
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
          <div className="flex gap-2 my-2 items-center">
            <Badge className="uppercase">{t('diary-post.badge')}</Badge>
            <Link
              className="text-muted-foreground text-sm"
              href={'/diary/' + post.tripDiary.id}
            >
              <span>{post.tripDiary.title}</span>
            </Link>
          </div>
          <div>
            <p className="text-sm sm:text-base">{post.message}</p>
          </div>
          <Medias medias={post.diaryPostMedias} />
        </div>
      </div>
    </article>
  );
});

DiaryPost.displayName = 'DiaryPost';
