'use client';

import { ListUsers } from '@/components/list-users';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea, ScrollAreaViewport } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import axios from '@/services/axios';
import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import React, { ReactNode, useState } from 'react';

type IDiaryLikedByList = {
  id: number;
  children: ReactNode;
};

export const DiaryLikedByList = ({ id, children }: IDiaryLikedByList) => {
  const [open, setOpen] = useState<boolean>();
  const t = useTranslations();

  const users = useQuery<User[]>({
    queryKey: ['diary-post-liked-by', id],
    queryFn: async () => (await axios.get<User[]>(`diary-posts/${id}/like`)).data,
    enabled: !!open,
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent className="flex flex-col h-[560px] sm:h-[560px] overflow-hidden">
        <DialogHeader>
          <DialogTitle>{t('diary-post.liked-by')}</DialogTitle>
        </DialogHeader>
        <Separator />
        <ScrollArea>
          <ScrollAreaViewport className="-mr-5 pr-5">
            {users.data && <ListUsers users={users.data} />}
          </ScrollAreaViewport>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
