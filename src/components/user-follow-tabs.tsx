import React, { ReactNode, useState } from 'react';
import { ListUsers } from '@/components/list-users';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery } from '@tanstack/react-query';
import axios from '@/services/axios';
import { useTranslations } from 'next-intl';

interface IUserFollowTabs {
  username: string;
  children: ReactNode;
  defaultTab: 'following' | 'followers';
}

export function UserFollowTabs({ username, children, defaultTab }: IUserFollowTabs) {
  const [open, setOpen] = useState<boolean>(false);
  const [tab, setTab] = useState<typeof defaultTab>(defaultTab);
  const t = useTranslations();

  const following = useQuery<User[]>(
    ['following', username],
    async () => (await axios.get<User[]>('/users/' + username + '/following')).data,
    {
      enabled: open,
    },
  );

  const followers = useQuery<User[]>(
    ['followers', username],
    async () => (await axios.get<User[]>('/users/' + username + '/followers')).data,
    {
      enabled: open,
    },
  );

  return (
    <Dialog
      open={open}
      onOpenChange={(e) => {
        setOpen(e);
        setTab(defaultTab);
      }}
    >
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent className="p-0 min-h-[560px]">
        <Tabs
          defaultValue={defaultTab}
          onValueChange={(value) => setTab(value as typeof defaultTab)}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="followers">{t('follow.followers')}</TabsTrigger>
            <TabsTrigger value="following">{t('follow.following')}</TabsTrigger>
          </TabsList>
          {[followers.data, following.data].map((tab, tabIndex) => (
            <TabsContent
              value={tabIndex === 0 ? 'followers' : 'following'}
              key={tabIndex}
              className="px-6 pt-2"
            >
              {!(followers.isLoading || following.isLoading) && tab && (
                <ListUsers users={tab} showIfUserFollowYou={tabIndex === 1} />
              )}
            </TabsContent>
          ))}
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
