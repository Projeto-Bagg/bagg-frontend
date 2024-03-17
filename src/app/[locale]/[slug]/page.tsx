'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import axios from '@/services/axios';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { useFollow } from '@/hooks/useFollow';
import { useUnfollow } from '@/hooks/useUnfollow';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { UserFollowTabs } from '@/components/user-follow-tabs';
import { UserCog } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter, Link } from '@/common/navigation';
import { usePathname } from 'next/navigation';
import { CountryFlag } from '@/components/ui/country-flag';
import { Skeleton } from '@/components/ui/skeleton';

export default function Profile({ params }: { params: { slug: string } }) {
  const pathname = usePathname();
  const auth = useAuth();
  const t = useTranslations();
  const follow = useFollow();
  const unfollow = useUnfollow();
  const router = useRouter();

  const user = useQuery<User>({
    queryKey: ['user', params.slug],
    queryFn: async () => (await axios.get<User>('/users/' + params.slug)).data,
  });

  const handleFollowClick = () => {
    if (!auth.isAuthenticated) {
      return router.push('/login');
    }

    user.data?.friendshipStatus.isFollowing
      ? unfollow.mutate(params.slug)
      : follow.mutate(params.slug);
  };

  if (!params.slug) {
    return;
  }

  return (
    <div className="h-full">
      {user.isLoading && <ProfileSkeleton />}
      {user.data && (
        <div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-4">
              <Dialog>
                <DialogTrigger>
                  <Avatar className="w-[100px] h-[100px] sm:w-[144px] sm:h-[144px]">
                    <AvatarImage src={user.data.image} />
                  </Avatar>
                </DialogTrigger>
                <DialogContent className="w-[90%] h-auto aspect-square sm:w-[440px] sm:h-[440px] p-0 sm:rounded-full rounded-full border-none">
                  <Avatar className="w-full h-full">
                    <AvatarImage src={user.data.image} />
                  </Avatar>
                </DialogContent>
              </Dialog>
              <div className="flex flex-col">
                <span className="text-lg sm:text-2xl">{user.data.fullName}</span>
                <span className="text-xs sm:text-base text-muted-foreground ">
                  @{user.data.username}
                </span>
                {user.data.friendshipStatus.followedBy && (
                  <span className="text-xs sm:text-sm text-muted-foreground">
                    {t('follow.follow-you')}
                  </span>
                )}
              </div>
            </div>
            {auth.user?.id !== user.data.id ? (
              <Button
                type="button"
                disabled={follow.isPending}
                onClick={handleFollowClick}
              >
                {user.data?.friendshipStatus.isFollowing
                  ? t('follow.following')
                  : t('follow.follow')}
              </Button>
            ) : (
              <Link
                href={{
                  pathname: '/[slug]/settings/profile',
                  params: { slug: params.slug },
                }}
              >
                <div>
                  <Button className="hidden sm:block">{t('profile.edit-profile')}</Button>
                  <Button className="flex sm:hidden rounded-full items-center justify-center w-10">
                    <UserCog className="shrink-0" size={20} />
                  </Button>
                </div>
              </Link>
            )}
          </div>
          <div className="text-sm mt-4">
            {user.data.bio && (
              <p className="mb-1 break-words whitespace-pre-wrap">{user.data.bio}</p>
            )}
            <div className="mb-1">
              <p className="text-muted-foreground">
                {t('profile.created-at', { joinDate: user.data.createdAt })}
              </p>
              <p className="text-muted-foreground">
                {t('profile.birthdate', { joinDate: user.data.birthdate })}
              </p>
              {user.data.city && (
                <div className="text-muted-foreground flex gap-1">
                  <p>{t('profile.city')}</p>
                  <Link
                    href={{
                      params: { slug: user.data.city.id },
                      pathname: '/city/[slug]',
                    }}
                    className="text-foreground flex hover:underline"
                  >
                    {user.data.city.name}, {user.data.city.region.name},{' '}
                    {user.data.city.region.country.name}
                    <CountryFlag
                      className="ml-1"
                      iso2={user.data.city.region.country.iso2}
                    />
                  </Link>
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <UserFollowTabs defaultTab="followers" username={params.slug}>
                <div className="flex gap-1">
                  <span className="font-bold">{user.data.followers}</span>
                  <span className="text-muted-foreground">{t('follow.followers')}</span>
                </div>
              </UserFollowTabs>
              <UserFollowTabs defaultTab="following" username={params.slug}>
                <div className="flex gap-1">
                  <span className="font-bold">{user.data.following}</span>
                  <span className="text-muted-foreground">{t('follow.following')}</span>
                </div>
              </UserFollowTabs>
            </div>
          </div>
        </div>
      )}
      <div className="flex mt-4 justify-center m-auto px-4 text-sm text-primary w-full sm:w-[432px]">
        <Link
          className={cn(
            pathname.endsWith(params.slug) && 'font-bold border-b-2 border-blue-600',
            'py-2 flex justify-center flex-1',
          )}
          href={{ pathname: '/[slug]', params: { slug: params.slug } }}
        >
          {t('profile.feed.tips')}
        </Link>
        <Link
          className={cn(
            pathname.endsWith('/diary-posts') && 'font-bold border-b-2 border-blue-600',
            'py-2 flex justify-center flex-1',
          )}
          href={{ pathname: '/[slug]/diary-posts', params: { slug: params.slug } }}
        >
          {t('profile.feed.posts')}
        </Link>
        <Link
          className={cn(
            pathname.endsWith('/diaries') && 'font-bold border-b-2 border-blue-600',
            'py-2 flex justify-center flex-1',
          )}
          href={{ pathname: '/[slug]/diaries', params: { slug: params.slug } }}
        >
          {t('profile.feed.diaries')}
        </Link>
        <Link
          className={cn(
            pathname.endsWith('/visits') && 'font-bold border-b-2 border-blue-600',
            'py-2 flex justify-center flex-1',
          )}
          href={{ pathname: '/[slug]/visits', params: { slug: params.slug } }}
        >
          {t('profile.feed.visits')}
        </Link>
      </div>
      <Separator />
    </div>
  );
}

const ProfileSkeleton = () => {
  return (
    <div className="p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-4">
          <Skeleton className="w-[100px] h-[100px] sm:w-[144px] sm:h-[144px] rounded-full" />
          <div className="flex flex-col gap-3">
            <Skeleton className="w-[110px] sm:w-[172px] h-5" />
            <Skeleton className="w-[80px] sm:w-[110px] h-4" />
          </div>
        </div>
        <Skeleton className="w-[96px] h-10" />
      </div>
      <div className="text-sm mt-4">
        <Skeleton className="w-[144px] mb-2 h-4" />
        <Skeleton className="w-[220px] mb-1.5 h-4" />
        <Skeleton className="w-[220px] mb-1.5 h-4" />
        <Skeleton className="w-[280px] mb-2 h-4" />
        <div className="flex gap-2">
          <Skeleton className="w-[86px] h-4" />
          <Skeleton className="w-[86px] h-4" />
        </div>
      </div>
    </div>
  );
};
