'use client';

import React, { HTMLProps, forwardRef } from 'react';
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
import { intlFormatDistance } from 'date-fns';
import { UserHoverCard } from '@/components/user-hovercard';
import { useLikeTip, useUnlikeTip, useDeleteTip } from '@/hooks/tip';
import { TipLikedByList } from '@/components/posts/tip-liked-by-list';
import { CountryFlag } from '@/components/ui/country-flag';
import { TipComments } from '@/components/posts/tip-comments';
import { Link, usePathname, useRouter } from '@/common/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { Medias } from '@/components/posts/medias';
import { Report } from '@/components/posts/report';
import { replaceByBold } from '@/utils/replace-by-bold';

export const Tip = forwardRef<
  HTMLDivElement,
  HTMLProps<HTMLDivElement> & {
    tip: Tip;
    withComments?: boolean;
    boldMessage?: string | null;
  }
>(({ tip, boldMessage, withComments, ...props }, forwardRef) => {
  const { toast } = useToast();
  const auth = useAuth();
  const queryClient = useQueryClient();
  const locale = useLocale();
  const like = useLikeTip();
  const unlike = useUnlikeTip();
  const deleteTip = useDeleteTip();
  const router = useRouter();
  const pathname = usePathname();
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

    toast({ title: t('commons.copy-link'), variant: 'success' });
  };

  const handleDeleteClick = async () => {
    await deleteTip.mutateAsync(+tip.id);

    if (pathname === '/tip/[slug]') {
      router.push({ pathname: '/home' });
    }
  };

  const handleClickSeeComments = () => {
    queryClient.setQueryData<Tip>(['tip', tip.id], tip);

    router.push({ params: { slug: tip.id }, pathname: '/tip/[slug]' });
  };

  return (
    <div {...props} ref={forwardRef} className="py-4 border-b">
      <div className="flex">
        <div className="shrink-0 mr-3">
          <UserHoverCard username={tip.user.username}>
            <Link
              href={{ params: { slug: tip.user.username }, pathname: '/[slug]' }}
              className="h-fit"
            >
              <Avatar className="h-[44px] w-[44px]">
                <AvatarImage src={tip.user.image} />
              </Avatar>
            </Link>
          </UserHoverCard>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex gap-2 items-start justify-between">
            <div className="flex flex-col min-w-0">
              <UserHoverCard username={tip.user.username}>
                <Link
                  className="hover:underline font-semibold truncate"
                  href={{ params: { slug: tip.user.username }, pathname: '/[slug]' }}
                >
                  {tip.user.fullName}
                </Link>
              </UserHoverCard>
              <UserHoverCard username={tip.user.username}>
                <Link
                  href={{ params: { slug: tip.user.username }, pathname: '/[slug]' }}
                  className="text-muted-foreground hover:underline text-sm"
                >
                  @{tip.user.username}
                </Link>
              </UserHoverCard>
            </div>
            <div className="flex shrink-0 items-center gap-2 text-muted-foreground">
              <TipLikedByList id={tip.id}>
                <span className="text-sm">{tip.likesAmount}</span>
              </TipLikedByList>
              <Heart
                data-test="like-tip"
                onClick={handleLikeClick}
                data-liked={tip.isLiked}
                size={20}
                className="data-[liked=true]:fill-red-600 data-[liked=true]:text-red-600 transition-all hover:text-red-600 cursor-pointer"
              />
              <span className="text-sm">
                {intlFormatDistance(tip.createdAt, new Date(), {
                  numeric: 'always',
                  style: 'narrow',
                  locale,
                })}
              </span>
              <DropdownMenu>
                <DropdownMenuTrigger data-test="tip-options">
                  <div className="hover:bg-primary-foreground p-1.5 [&>svg]:hover:text-primary transition-all rounded-full">
                    <MoreHorizontal size={20} className="transition-all" />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem data-test="tip-copy-link" onSelect={handleShareClick}>
                    {t('tip.copy-link')}
                  </DropdownMenuItem>
                  {auth.user && (
                    <>
                      {auth.user.id !== tip.user.id && (
                        <Report reportType="tip" id={tip.id}>
                          <DropdownMenuItem
                            data-test="report"
                            onSelect={(e) => e.preventDefault()}
                          >
                            {t('reports.title')}
                          </DropdownMenuItem>
                        </Report>
                      )}
                      {auth.user.id === tip.user.id && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem
                              data-test="tip-delete"
                              onSelect={(e) => e.preventDefault()}
                              className="font-bold"
                            >
                              {t('tip.delete')}
                            </DropdownMenuItem>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                {t('tip.delete-modal.title')}
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                {t('tip.delete-modal.description')}
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>
                                {t('tip.delete-modal.cancel')}
                              </AlertDialogCancel>
                              <AlertDialogAction
                                data-test="tip-delete-confirm"
                                onClick={handleDeleteClick}
                              >
                                {t('tip.delete-modal.action')}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
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
              href={{ params: { slug: tip.city.id }, pathname: '/city/[slug]' }}
            >
              <div className="flex gap-2 text-sm">
                <span className="max-w-[216px] md:max-w-[unset] text-ellipsis overflow-hidden whitespace-nowrap">
                  {tip.city.name}, {tip.city.region.name}, {tip.city.region.country.name}
                </span>
                <CountryFlag iso2={tip.city.region.country.iso2} />
              </div>
            </Link>
          </div>
          <div>
            <Link href={{ params: { slug: tip.id }, pathname: '/tip/[slug]' }}>
              <p
                dangerouslySetInnerHTML={{
                  __html: boldMessage
                    ? replaceByBold(tip.message, boldMessage.split(' '))
                    : tip.message,
                }}
              />
            </Link>
          </div>
          <Medias medias={tip.tipMedias} />
          {!withComments && (
            <div className="mt-1">
              <button
                data-test="see-comments"
                className="text-muted-foreground text-sm"
                onClick={handleClickSeeComments}
              >
                {t('tip.comments', { count: tip.commentsAmount })}
              </button>
            </div>
          )}
        </div>
      </div>
      {withComments && <TipComments tip={tip} />}
    </div>
  );
});

Tip.displayName = 'Tip';
