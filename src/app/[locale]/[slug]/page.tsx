'use client';

import React from 'react';
import axios from '@/services/axios';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/context/auth-context';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { useFollow } from '@/hooks/useFollow';
import { useUnFollow } from '@/hooks/useUnfollow';
import { EditProfile } from '@/components/edit-profile';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

export default function Profile({ params }: { params: { slug: string } }) {
  const auth = useAuth();
  const t = useTranslations('profile');
  const follow = useFollow();
  const unfollow = useUnFollow();

  const user = useQuery<User>(
    ['user', params.slug],
    async () => (await axios.get<User>('/users/' + params.slug)).data,
  );

  const friendshipStatus = useQuery(
    ['friendship', params.slug],
    async () =>
      (await axios.get<FriendshipStatus>('/users/friendship/' + params.slug)).data,
    {
      enabled: auth.isAuthenticated,
    },
  );

  if (!user.data || !params.slug || user.isLoading) {
    return;
  }

  return (
    <div className="p-8 border-b">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Dialog>
            <DialogTrigger>
              <Avatar className="w-[184px] h-[184px]">
                <AvatarImage src={user.data.image} />
                <AvatarFallback>
                  <span className="text-4xl">
                    {user.data.username.charAt(0).toUpperCase()}
                  </span>
                </AvatarFallback>
              </Avatar>
            </DialogTrigger>
            <DialogContent className="w-auto md:w-auto sm:w-auto p-0 md:rounded-full rounded-full border-none">
              <Avatar className="w-[400px] h-[400px]">
                <AvatarImage src={user.data.image} />
                <AvatarFallback>
                  <span className="text-4xl">
                    {user.data.username.charAt(0).toUpperCase()}
                  </span>
                </AvatarFallback>
              </Avatar>
            </DialogContent>
          </Dialog>
          <div className="flex flex-col">
            <span className="text-2xl">@{user.data.username}</span>
            <span className="text-sm text-slate-400">{user.data.fullName}</span>
            {friendshipStatus.data?.followedBy && (
              <span className="text-slate-400 text-sm">{t('follow_you')}</span>
            )}
          </div>
        </div>
        {auth.user?.id !== user.data.id ? (
          <Button
            type="button"
            disabled={follow.isLoading || !auth.isAuthenticated}
            onClick={() => {
              friendshipStatus.data?.following
                ? unfollow.mutate(params.slug as string)
                : follow.mutate(params.slug as string);
            }}
          >
            {friendshipStatus.data?.following ? t('following') : t('follow')}
          </Button>
        ) : (
          <EditProfile />
        )}
      </div>
      <div className="text-sm mt-4 ">
        {user.data.bio && <p className="mb-1">{user.data.bio}</p>}
        <div className="mb-1">
          <p className="text-slate-400">
            {t('createdAt', { joinDate: user.data.createdAt })}
          </p>
          <p className="text-slate-400">
            {t('birthdate', { joinDate: user.data.birthdate })}
          </p>
        </div>
        <div className="flex gap-2">
          <div className="flex gap-1">
            <span className="font-bold">{user.data.followers}</span>
            <span className="text-slate-400">{t('followers')}</span>
          </div>
          <div className="flex gap-1">
            <span className="font-bold">{user.data.following}</span>
            <span className="text-slate-400">{t('following')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
