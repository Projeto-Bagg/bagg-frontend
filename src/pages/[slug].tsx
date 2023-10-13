import React from 'react';
import axios from '../services/axios';
import { GetStaticPaths, GetStaticProps } from 'next';
import { NextSeo } from 'next-seo';
import { useRouter } from 'next/router';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../context/auth-context';
import { ProfilePicDialog } from '../components/profile-pic-dialog';
import { useTranslations } from 'next-intl';
import { Button } from '../components/ui/button';
import { useFollow } from '../hooks/useFollow';
import { useUnFollow } from '../hooks/useUnfollow';
import { EditProfile } from '../components/edit-profile';

export default function Profile() {
  const router = useRouter();
  const auth = useAuth();
  const t = useTranslations('profile');
  const follow = useFollow();
  const unfollow = useUnFollow();

  const user = useQuery<User>(
    ['user', router.query.slug],
    async () => (await axios.get<User>('/users/' + router.query.slug)).data,
  );

  const friendshipStatus = useQuery(
    ['friendship', router.query.slug],
    async () =>
      (await axios.get<FriendshipStatus>('/users/friendship/' + router.query.slug)).data,
  );

  if (!user.data || !router.query.slug || user.isLoading) {
    return;
  }

  return (
    <>
      <NextSeo title={router.query.slug && 'Perfil de ' + router.query.slug} />
      <div className="p-8 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {auth.user?.id === user.data.id ? (
              <ProfilePicDialog>
                <Avatar className="w-[184px] h-[184px]">
                  <AvatarImage src={auth.user?.image} />
                  <AvatarFallback>
                    <span className="text-4xl">
                      {auth.user?.username.charAt(0).toUpperCase()}
                    </span>
                  </AvatarFallback>
                </Avatar>
              </ProfilePicDialog>
            ) : (
              <Avatar className="w-[184px] h-[184px]">
                <AvatarImage src={user.data.image} />
                <AvatarFallback>
                  <span className="text-4xl">
                    {user.data.username.charAt(0).toUpperCase()}
                  </span>
                </AvatarFallback>
              </Avatar>
            )}
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
                  ? unfollow.mutate(router.query.slug as string)
                  : follow.mutate(router.query.slug as string);
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
    </>
  );
}

export const getStaticPaths: GetStaticPaths<{ slug: string }> = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async (context) => {
  return {
    props: {
      messages: (
        await import(
          `../messages/${context.locale === 'default' ? 'pt' : context.locale}.json`
        )
      ).default,
    },
  };
};
