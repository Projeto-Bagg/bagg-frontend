'use client';

import { Link } from '@/common/navigation';
import { Report } from '@/components/posts/report';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { UserHoverCard } from '@/components/user-hovercard';
import { useAuth } from '@/context/auth-context';
import { useDeleteTipComment } from '@/hooks/tip';
import { intlFormatDistance } from 'date-fns';
import { Settings } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import React from 'react';

interface TipCommentProps {
  comment: TipComment;
  tipId: number;
}

export const TipComment = ({ comment, tipId }: TipCommentProps) => {
  const auth = useAuth();
  const locale = useLocale();
  const t = useTranslations();
  const deleteTipComment = useDeleteTipComment();

  return (
    <div key={comment.id} className="flex py-2 gap-3">
      <div className="shrink-0">
        <UserHoverCard username={comment.user.username}>
          <Link
            className="font-bold hover:underline"
            href={{
              params: { slug: comment.user.username },
              pathname: '/[slug]',
            }}
          >
            <Avatar>
              <AvatarImage
                className="h-[44px] w-[44px] rounded-full"
                src={comment.user.image}
              />
            </Avatar>
          </Link>
        </UserHoverCard>
      </div>
      <div className="w-full">
        <div className="flex items-center gap-3 w-full">
          <div className="flex gap-2 items-center justify-between w-full">
            <div className="flex gap-1 text-ellipsis overflow-hidden whitespace-nowrap">
              <UserHoverCard username={comment.user.username}>
                <Link
                  className="font-bold hover:underline"
                  href={{
                    params: { slug: comment.user.username },
                    pathname: '/[slug]',
                  }}
                >
                  {comment.user.fullName}
                </Link>
              </UserHoverCard>
              <UserHoverCard username={comment.user.username}>
                <Link
                  className="text-muted-foreground hover:underline"
                  href={{
                    params: { slug: comment.user.username },
                    pathname: '/[slug]',
                  }}
                >
                  @{comment.user.username}
                </Link>
              </UserHoverCard>
            </div>
            <div className="flex gap-2 text-sm items-center text-muted-foreground shrink-0">
              <span>
                {intlFormatDistance(comment.createdAt, new Date(), {
                  numeric: 'always',
                  style: 'narrow',
                  locale,
                })}
              </span>
              {auth.user && (
                <DropdownMenu modal={false}>
                  <DropdownMenuTrigger asChild>
                    <button data-test="comment-options">
                      <Settings className="w-[20px] h-[20px]" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <Report id={comment.id} reportType="tip-comment">
                      <DropdownMenuItem
                        data-test="report"
                        onSelect={(e) => e.preventDefault()}
                      >
                        {t('reports.title')}
                      </DropdownMenuItem>
                    </Report>
                    {auth.user.id === comment.user.id && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <DropdownMenuItem
                            data-test="delete"
                            onSelect={(e) => e.preventDefault()}
                            className="font-bold"
                          >
                            {t('tip.comment.delete.label')}
                          </DropdownMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              {t('tip.comment.delete.delete-modal.title')}
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              {t('tip.comment.delete.delete-modal.description')}
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>
                              {t('tip.comment.delete.delete-modal.cancel')}
                            </AlertDialogCancel>
                            <AlertDialogAction
                              data-test="confirm"
                              onClick={() =>
                                deleteTipComment.mutate({
                                  commentId: comment.id,
                                  tipId,
                                })
                              }
                            >
                              {t('tip.comment.delete.delete-modal.action')}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        </div>
        <span>{comment.message}</span>
      </div>
    </div>
  );
};
