import React, { FormEvent } from 'react';
import { Link } from '@/common/navigation';
import { UserHoverCard } from '@/components/user-hovercard';
import { useQuery } from '@tanstack/react-query';
import axios from '@/services/axios';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
import { Report } from '@/components/posts/report';
import { TipComment } from '@/components/posts/tip-comment';

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
        <form
          data-test="create-comment-form"
          className="flex h-full mt-2 sm:mt-3 gap-3"
          onSubmit={handleSubmit}
        >
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
        <div data-test="comments" className="divide-y mt-2">
          {comments.map((comment) => (
            <TipComment key={comment.id} comment={comment} tipId={tip.id} />
          ))}
        </div>
      )}
    </div>
  );
};
