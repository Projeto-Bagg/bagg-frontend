import { DiaryLikedByList } from '@/components/diary-liked-by-list';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/context/auth-context';
import { useLikeDiaryPost } from '@/hooks/useLikeDiaryPost';
import { useUnlikeDiaryPost } from '@/hooks/useUnlikeDiaryPost';
import { Heart, MoreHorizontal, User2 } from 'lucide-react';
import { useFormatter, useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

export const DiaryPost = ({ post }: { post: DiaryPost }) => {
  const auth = useAuth();
  const formatter = useFormatter();
  const like = useLikeDiaryPost();
  const unlike = useUnlikeDiaryPost();
  const router = useRouter();
  const t = useTranslations();

  const handleLikeClick = () => {
    if (!auth.user) {
      return router.push('/login');
    }

    if (post.isLiked) {
      return unlike.mutate(post.id);
    }
    return like.mutate(post.id);
  };

  return (
    <article className="md:m-4 p-4 md:px-7 space-y-3 border-b md:border md:border-border md:rounded-lg">
      <div className="flex gap-3">
        <Link href={'/' + post.user.username}>
          <Avatar className="h-[44px] w-[44px] shrink-0">
            <AvatarImage src={post.user.image} />
          </Avatar>
        </Link>
        <div className="w-full">
          <div className="flex gap-2 items-start justify-between">
            <Link href={'/' + post.user.username}>
              <div className="flex flex-col">
                <span>{post.user.fullName}</span>
                <span className="text-sm text-muted-foreground">
                  @{post.user.username}
                </span>
              </div>
            </Link>
            <div className="flex items-center gap-2 text-muted-foreground">
              <DiaryLikedByList id={post.id}>
                <span>{post.likedBy}</span>
              </DiaryLikedByList>
              <Heart
                onClick={handleLikeClick}
                data-liked={post.isLiked}
                size={20}
                className="data-[liked=true]:fill-red-600 data-[liked=true]:text-red-600 cursor-pointer text-foreground"
              />
              <span className="text-sm">
                {formatter.relativeTime(post.createdAt, new Date())}
              </span>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <div className="hover:bg-primary-foreground p-1.5 [&>svg]:hover:text-primary transition-all rounded-full">
                    <MoreHorizontal size={20} className="transition-all" />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>{t('diaryPost.share')}</DropdownMenuItem>
                  {auth.user?.id === post.user.id && (
                    <>
                      <DropdownMenuItem>{t('diaryPost.edit')}</DropdownMenuItem>
                      <DropdownMenuItem className="font-bold">
                        {t('diaryPost.delete')}
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <div className="flex gap-2 my-2">
            <Badge>{t('diaryPost.diaryBadge')}</Badge>
            <span className="text-muted-foreground text-sm">
              {post.tripDiary.title} {' • '} {post.tripDiary.message}
            </span>
          </div>
          <div className="mb-2">
            <h3 className="text-xl font-bold">{post.title}</h3>
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
