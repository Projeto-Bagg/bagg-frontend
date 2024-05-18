'use client';

import { DiaryPost } from '@/components/posts/diary-post';
import { Tip } from '@/components/posts/tip';
import { UseInfiniteQueryResult } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

export const Ad = ({ ad }: { ad: Ad }) => {
  const t = useTranslations();

  return (
    <div key={ad.url} className="pl-14 py-4 border-b">
      <Link href={ad.url} target="_blank">
        <div className="w-full relative">
          <img
            className="shadow rounded-lg w-full object-contain"
            alt=""
            src={ad.adImg}
          />
          <div className="shadow text-foreground/90 flex items-center absolute bottom-2 sm:bottom-4 right-2 sm:right-4 text-xs sm:text-sm border bg-background/85 px-1 sm:px-2 py-0.5 sm:py-1 rounded-sm">
            <span>{t('homepage.ad.label')}</span>
            <span className="mx-1 h-3 inline-block w-[1px] bg-foreground/60" />
            <span>{ad.company}</span>
          </div>
        </div>
      </Link>
    </div>
  );
};

interface FeedProps {
  feed: UseInfiniteQueryResult<Pagination<(Ad | Tip)[] | DiaryPost[]> | undefined>;
  emptyFeedComponent?: React.JSX.Element;
}

export const Feed = ({
  feed: { data, fetchNextPage, hasNextPage, isFetchingNextPage, isPending },
  emptyFeedComponent,
}: FeedProps) => {
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage]);

  if (data && data.pages[0].length === 0) {
    return emptyFeedComponent ? emptyFeedComponent : <></>;
  }

  return (
    <>
      {data &&
        data.pages.map((page, pageIndex) =>
          page.map((element, index) => (
            <div
              ref={page.length - 1 === index ? ref : undefined}
              key={`${pageIndex}-${index}`}
            >
              {determineIfIsAd(element) ? (
                <Ad key={element.url} ad={element} />
              ) : determineIfIsTip(element) ? (
                <Tip tip={element} key={element.id} />
              ) : (
                <DiaryPost post={element} />
              )}
            </div>
          )),
        )}
      {(isFetchingNextPage || isPending) && (
        <div className="pt-4 flex justify-center">
          <img src={'/spinner.svg'} alt="" className="w-11 h-full" />
        </div>
      )}
    </>
  );
};

const determineIfIsAd = (toBeDetermined: Ad | Tip | DiaryPost): toBeDetermined is Ad => {
  if ((toBeDetermined as Ad).adImg) {
    return true;
  }
  return false;
};

const determineIfIsTip = (toBeDetermined: Tip | DiaryPost): toBeDetermined is Tip => {
  if ((toBeDetermined as Tip).tipMedias) {
    return true;
  }
  return false;
};
