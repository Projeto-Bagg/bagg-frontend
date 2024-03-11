'use client';

import { ListUsers } from '@/components/list-users';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import axios from '@/services/axios';
import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import React, { ReactNode, useState } from 'react';

type TipLikedByListProps = {
  id: number;
  children: ReactNode;
};

export const TipLikedByList = ({ id, children }: TipLikedByListProps) => {
  const [open, setOpen] = useState<boolean>();
  const t = useTranslations();

  const users = useQuery<User[]>({
    queryKey: ['tipLikedBy', id],
    queryFn: async () => (await axios.get<User[]>(`tips/${id}/like`)).data,
    enabled: !!open,
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent className="flex flex-col h-[560px] sm:h-[560px] overflow-hidden">
        <DialogHeader>
          <DialogTitle>{t('tip.likedBy')}</DialogTitle>
        </DialogHeader>
        <Separator />
        <ScrollArea className="-mr-5 pr-5">
          {users.data && <ListUsers users={users.data} />}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
