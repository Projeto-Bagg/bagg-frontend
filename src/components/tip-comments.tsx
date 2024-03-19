import React, { FormEvent } from 'react';
import { Link } from '@/common/navigation';
import { UserHoverCard } from '@/components/user-hovercard';
import { useQuery } from '@tanstack/react-query';
import axios from '@/services/axios';
import { Avatar } from '@radix-ui/react-avatar';
import { AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/context/auth-context';
import { intlFormatDistance } from 'date-fns';
import { useLocale, useTranslations } from 'next-intl';
import { Settings } from 'lucide-react';
import { useDeleteTipComment } from '@/hooks/useDeleteTipComment';
import { useCreateTipComment } from '@/hooks/useCreateTipComment';
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

interface TipCommentProps {
  tip: Tip;
}

export const TipComments = ({ tip }: TipCommentProps) => {
  const auth = useAuth();
  const locale = useLocale();
  const deleteTipComment = useDeleteTipComment();
  const createTipComment = useCreateTipComment();
  const t = useTranslations();

  const { data: comments, isFetching } = useQuery<TipComment[]>({
    queryKey: ['tip-comments', tip.id],
    queryFn: async () => (await axios.get<TipComment[]>('/tip-comments/' + tip.id)).data,
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const message = (e.currentTarget[0] as HTMLInputElement).value;
    e.currentTarget.reset();

    if (!message) {
      return;
    }

    createTipComment.mutate({ message, tipId: tip.id });
  };

  return (
    <div>
      {auth.user && (
        <form className="flex h-full mt-2 sm:mt-3 gap-3" onSubmit={handleSubmit}>
          <Link
            href={{ params: { slug: auth.user.username }, pathname: '/[slug]' }}
            prefetch={false}
            className="shrink-0"
          >
            <Avatar>
              <AvatarImage
                className="h-[44px] w-[44px] rounded-full"
                src={auth.user.image}
              />
            </Avatar>
          </Link>
          <Input className="h-[unset]" placeholder="Faça um comentário" />
          <Button className="min-w-[72px] h-[unset]" type="submit">
            Enviar
          </Button>
        </form>
      )}
      {!isFetching && comments && (
        <div className="divide-y mt-2">
          {comments.map((comment) => (
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
                          className="text-muted-foreground"
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
                      {auth.user?.id === comment.user.id && (
                        <DropdownMenu modal={false}>
                          <DropdownMenuTrigger asChild>
                            <button>
                              <Settings className="w-[20px] h-[20px]" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem
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
                                    onClick={() =>
                                      deleteTipComment.mutate({
                                        commentId: comment.id,
                                        tipId: tip.id,
                                      })
                                    }
                                  >
                                    {t('tip.comment.delete.delete-modal.action')}
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                  </div>
                </div>
                <span>{comment.message}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
