'use client';

import React, { HTMLProps, forwardRef } from 'react';
import { DiaryLikedByList } from '@/components/posts/diary-liked-by-list';
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
import {
  useDeleteDiaryPost,
  useLikeDiaryPost,
  useUnlikeDiaryPost,
} from '@/hooks/diary-post';
import { Heart, MoreHorizontal } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { intlFormatDistance } from 'date-fns';
import { UserHoverCard } from '@/components/user-hovercard';
import { Medias } from '@/components/posts/medias';
import { Report } from '@/components/posts/report';
import { Link, useRouter } from '@/common/navigation';

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

    toast({ title: t('commons.copy-link'), variant: 'success' });
  };

  const handleDeleteClick = async () => {
    await deletePost.mutateAsync(post.id);

    router.push('/home');
  };

  return (
    <div {...props} ref={forwardRef} className="py-4 flex border-b">
      <div className="shrink-0 mr-3">
        <UserHoverCard username={post.user.username}>
          <Link
            href={{ params: { slug: post.user.username }, pathname: '/[slug]' }}
            className="h-fit"
          >
            <Avatar className="h-[44px] w-[44px]">
              <AvatarImage src={post.user.image} />
            </Avatar>
          </Link>
        </UserHoverCard>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex gap-2 items-start justify-between">
          <div className="flex flex-col min-w-0">
            <UserHoverCard username={post.user.username}>
              <Link
                href={{ params: { slug: post.user.username }, pathname: '/[slug]' }}
                className="truncate font-semibold hover:underline"
              >
                {post.user.fullName}
              </Link>
            </UserHoverCard>
            <UserHoverCard username={post.user.username}>
              <Link
                href={{ params: { slug: post.user.username }, pathname: '/[slug]' }}
                className="text-muted-foreground text-sm hover:underline"
              >
                @{post.user.username}
              </Link>
            </UserHoverCard>
          </div>
          <div className="flex shrink-0 items-center gap-2 text-muted-foreground">
            <DiaryLikedByList id={post.id}>
              <span className="text-sm">{post.likesAmount}</span>
            </DiaryLikedByList>
            <Heart
              data-test="diary-post-like"
              onClick={handleLikeClick}
              data-liked={post.isLiked}
              size={20}
              className="data-[liked=true]:fill-red-600 data-[liked=true]:text-red-600 hover:text-red-600 transition-all cursor-pointer"
            />
            <span className="text-sm">
              {intlFormatDistance(post.createdAt, new Date(), {
                numeric: 'always',
                style: 'narrow',
                locale,
              })}
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger data-test="diary-post-options">
                <div className="hover:bg-primary-foreground p-1.5 [&>svg]:hover:text-primary transition-all rounded-full">
                  <MoreHorizontal size={20} className="transition-all" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem
                  data-test="diary-post-copy-link"
                  onSelect={handleShareClick}
                >
                  {t('diary-post.copy-link')}
                </DropdownMenuItem>
                {auth.user?.id !== post.user.id && (
                  <Report id={post.id} reportType="diary-post">
                    <DropdownMenuItem
                      data-test="report"
                      onSelect={(e) => e.preventDefault()}
                    >
                      {t('reports.title')}
                    </DropdownMenuItem>
                  </Report>
                )}
                {auth.user?.id === post.user.id && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <DropdownMenuItem
                        data-test="diary-post-delete"
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
                        <AlertDialogAction
                          data-test="diary-post-delete-confirm"
                          onClick={handleDeleteClick}
                        >
                          {t('diary-post.delete-modal.action')}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="flex gap-2 my-2 items-center">
          <Badge className="uppercase">{t('diary-post.badge')}</Badge>
          <Link
            className="text-muted-foreground text-sm hover:underline"
            href={{ params: { slug: post.tripDiary.id }, pathname: '/diary/[slug]' }}
          >
            {post.tripDiary.title}
          </Link>
        </div>
        <div>
          <Link href={{ params: { slug: post.id }, pathname: '/diary/post/[slug]' }}>
            <p>{post.message}</p>
          </Link>
        </div>
        <Medias medias={post.diaryPostMedias} />
      </div>
    </div>
  );
});

DiaryPost.displayName = 'DiaryPost';
