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
import { useRouter } from 'next/navigation';
import { Separator } from '@/components/ui/separator';

export default function Profile({ params }: { params: { slug: string } }) {
  const auth = useAuth();
  const t = useTranslations('profile');
  const follow = useFollow();
  const unfollow = useUnFollow();
  const router = useRouter();

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

  const handleFollowClick = () => {
    if (!auth.isAuthenticated) {
      return router.push('/login');
    }

    friendshipStatus.data?.following
      ? unfollow.mutate(params.slug)
      : follow.mutate(params.slug);
  };

  if (!user.data || !params.slug || user.isLoading) {
    return;
  }

  return (
    <div className="container">
      <div className="p-4 lg:p-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 lg:gap-4">
            <Dialog>
              <DialogTrigger>
                <Avatar className="w-[80px] h-[80px] lg:w-[184px] lg:h-[184px]">
                  <AvatarImage draggable={false} src={user.data.image} />
                  <AvatarFallback>
                    <span className="text-xl lg:text-4xl">
                      {user.data.username.charAt(0).toUpperCase()}
                    </span>
                  </AvatarFallback>
                </Avatar>
              </DialogTrigger>
              <DialogContent className="w-[90%] md:w-auto sm:w-auto p-0 sm:rounded-full rounded-full border-none">
                <Avatar className="w-full h-full lg:w-[400px] lg:h-[400px]">
                  <AvatarImage draggable={false} src={user.data.image} />
                  <AvatarFallback>
                    <span className="text-4xl">
                      {user.data.username.charAt(0).toUpperCase()}
                    </span>
                  </AvatarFallback>
                </Avatar>
              </DialogContent>
            </Dialog>
            <div className="flex flex-col">
              <span className="text-lg lg:text-2xl">@{user.data.username}</span>
              <span className="text-xs lg:text-base text-muted-foreground">
                {user.data.fullName}
              </span>
              {friendshipStatus.data?.followedBy && (
                <span className="text-xs lg:text-base text-muted-foreground">
                  {t('followYou')}
                </span>
              )}
            </div>
          </div>
          {auth.user?.id !== user.data.id ? (
            <Button type="button" disabled={follow.isLoading} onClick={handleFollowClick}>
              {friendshipStatus.data?.following ? t('following') : t('follow')}
            </Button>
          ) : (
            <EditProfile>
              <Button>{t('editProfile')}</Button>
            </EditProfile>
          )}
        </div>
        <div className="text-sm mt-4">
          {user.data.bio && <p className="mb-1">{user.data.bio}</p>}
          <div className="mb-1">
            <p className="text-muted-foreground">
              {t('createdAt', { joinDate: user.data.createdAt })}
            </p>
            <p className="text-muted-foreground">
              {t('birthdate', { joinDate: user.data.birthdate })}
            </p>
          </div>
          <div className="flex gap-2">
            <div className="flex gap-1">
              <span className="font-bold">{user.data.followers}</span>
              <span className="text-muted-foreground">{t('followers')}</span>
            </div>
            <div className="flex gap-1">
              <span className="font-bold">{user.data.following}</span>
              <span className="text-muted-foreground">{t('following')}</span>
            </div>
          </div>
        </div>
      </div>
      <Separator />
    </div>
  );
}
