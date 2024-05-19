'use client';

import { Link } from '@/common/navigation';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { UserHoverCard } from '@/components/user-hovercard';
import { cn } from '@/lib/utils';
import { intlFormatDistance } from 'date-fns';
import { useLocale } from 'next-intl';
import React, { ImgHTMLAttributes } from 'react';

interface GalleryImage extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'alt' | 'src'> {
  image: CountryCityImage;
}

export const GalleryImage = ({ image, className, ...props }: GalleryImage) => {
  const locale = useLocale();

  return (
    <div key={image.id} className={cn('relative aspect-square w-full h-full', className)}>
      <img
        src={image.url}
        alt=""
        {...props}
        className={cn(
          'object-center absolute w-full h-full inset-0 text-transparent',
          className,
        )}
      />
      <div className="absolute h-1/2 bottom-0 left-0 w-full">
        <div className="absolute w-full h-full bg-black gradient-mask-t-[rgba(0,0,0,1.0)]" />
        <div className="flex h-full py-3 px-4 relative items-end">
          <div className="flex text-white w-full items-center text-sm justify-between">
            <div className="flex items-center gap-2">
              <UserHoverCard username={image.user.username}>
                <Link
                  href={{
                    params: { slug: image.user.username },
                    pathname: '/[slug]',
                  }}
                >
                  <Avatar className="text-foreground">
                    <AvatarImage src={image.user.image} />
                  </Avatar>
                </Link>
              </UserHoverCard>
              <div className="flex flex-col">
                <UserHoverCard username={image.user.username}>
                  <Link
                    className="hover:underline font-semibold"
                    href={{
                      params: { slug: image.user.username },
                      pathname: '/[slug]',
                    }}
                  >
                    {image.user.fullName}
                  </Link>
                </UserHoverCard>
                <UserHoverCard username={image.user.username}>
                  <Link
                    className="hover:underline dark:text-muted-foreground text-muted"
                    href={{
                      params: { slug: image.user.username },
                      pathname: '/[slug]',
                    }}
                  >
                    @{image.user.username}
                  </Link>
                </UserHoverCard>
              </div>
            </div>
            <div className="flex items-center gap-1 dark:text-muted-foreground text-muted">
              {image.city && (
                <>
                  <Link
                    className="hover:underline text-primary"
                    href={{
                      params: { slug: image.city.id },
                      pathname: '/city/[slug]',
                    }}
                  >
                    {image.city.name}
                  </Link>
                  {'•'}
                </>
              )}
              <span>
                {intlFormatDistance(image.createdAt, new Date(), {
                  numeric: 'always',
                  style: 'narrow',
                  locale,
                })}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
