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

export default function Profile({ params }: { params: { slug: string } }) {
  const pathname = usePathname();
  const auth = useAuth();
  const t = useTranslations();
  const follow = useFollow();
  const unfollow = useUnfollow();
  const router = useRouter();

  const user = useQuery<UserWithCity>({
    queryKey: ['user', params.slug],
    queryFn: async () => (await axios.get<UserWithCity>('/users/' + params.slug)).data,
  });

  const handleFollowClick = () => {
    if (!auth.isAuthenticated) {
      return router.push('/login');
    }

    user.data?.isFollowing ? unfollow.mutate(params.slug) : follow.mutate(params.slug);
  };

  if (!user.data || !params.slug || user.isLoading) {
    return;
  }

  return (
    <div className="h-full">
      <div className="p-4 md:px-11">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 lg:gap-4">
            <Dialog>
              <DialogTrigger>
                <Avatar className="w-[100px] h-[100px] lg:w-[144px] lg:h-[144px]">
                  <AvatarImage src={user.data.image} />
                </Avatar>
              </DialogTrigger>
              <DialogContent className="w-[90%] h-auto aspect-square md:w-[440px] md:h-[440px] p-0 sm:rounded-full rounded-full border-none">
                <Avatar className="w-full h-full">
                  <AvatarImage src={user.data.image} />
                </Avatar>
              </DialogContent>
            </Dialog>
            <div className="flex flex-col">
              <span className="text-lg lg:text-2xl">{user.data.fullName}</span>
              <span className="text-xs lg:text-base text-muted-foreground ">
                @{user.data.username}
              </span>
              {user.data?.followedBy && (
                <span className="text-xs lg:text-base text-muted-foreground">
                  {t('follow.followYou')}
                </span>
              )}
            </div>
          </div>
          {auth.user?.id !== user.data.id ? (
            <Button type="button" disabled={follow.isPending} onClick={handleFollowClick}>
              {user.data?.isFollowing ? t('follow.following') : t('follow.follow')}
            </Button>
          ) : (
            <Link
              href={{
                pathname: '/[slug]/settings/profile',
                params: { slug: params.slug },
              }}
            >
              <div>
                <Button className="hidden md:block">{t('profile.editProfile')}</Button>
                <Button className="flex md:hidden rounded-full items-center justify-center w-10">
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
              {t('profile.createdAt', { joinDate: user.data.createdAt })}
            </p>
            <p className="text-muted-foreground">
              {t('profile.birthdate', { joinDate: user.data.birthdate })}
            </p>
            <div className="text-muted-foreground flex gap-1">
              <p>{t('profile.city')}</p>
              <Link
                href={{ params: { slug: user.data.city.id }, pathname: '/city/[slug]' }}
                className="text-foreground flex"
              >
                {user.data.city.name}, {user.data.city.region.name},{' '}
                {user.data.city.region.country.name}
                <CountryFlag className="ml-1" iso2={user.data.city.region.country.iso2} />
              </Link>
            </div>
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
      <div className="flex justify-center m-auto px-4 md:px-11 text-sm text-primary w-full md:w-[432px]">
        <Link
          className={cn(
            pathname.endsWith(params.slug) && 'font-bold border-b-2 border-blue-600',
            'py-2 flex justify-center flex-1',
          )}
          href={{ pathname: '/[slug]', params: { slug: params.slug } }}
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
            pathname.endsWith('/likes') && 'font-bold border-b-2 border-blue-600',
            'py-2 flex justify-center flex-1',
          )}
          href={{ pathname: '/[slug]/likes', params: { slug: params.slug } }}
        >
          {t('profile.feed.likes')}
        </Link>
      </div>
      <Separator />
    </div>
  );
}
