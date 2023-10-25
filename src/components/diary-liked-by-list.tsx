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
import React, { ReactNode } from 'react';

type IDiaryLikedByList = {
  id: number;
  children: ReactNode;
};

export const DiaryLikedByList = ({ id, children }: IDiaryLikedByList) => {
  const users = useQuery<User[]>(
    ['diaryPostLikedBy', id],
    async () => (await axios.get<User[]>(`diaryPosts/${id}/like`)).data,
  );

  return (
    <Dialog>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent className="flex flex-col h-[560px] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Curtido por</DialogTitle>
        </DialogHeader>
        <Separator />
        <ScrollArea className="-mr-5 pr-5">
          {users.data && <ListUsers users={users.data} />}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
