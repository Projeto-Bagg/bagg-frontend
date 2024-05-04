'use client';

import { TipComment } from '@/components/posts/tip-comment';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import axios from '@/services/axios';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { produce } from 'immer';
import { useTranslations } from 'next-intl';
import React, { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';

export const TipCommentReports = () => {
  const [openDialogIndex, setOpenDialogIndex] = useState<number | null>(null);
  const { ref, inView } = useInView();
  const queryClient = useQueryClient();

  const {
    data: tipCommentReports,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery<TipCommentReport[]>({
    queryKey: ['tip-comment-reports'],
    queryFn: async ({ pageParam }) =>
      (
        await axios.get<TipCommentReport[]>('/admin/tip-comment-reports', {
          params: {
            page: pageParam,
          },
        })
      ).data,
    initialPageParam: 1,
    getNextPageParam: (page, allPages) =>
      page.length === 10 ? allPages.length + 1 : null,
  });

  const removeFromList = (id: number) => {
    queryClient.setQueryData<Pagination<TipReport[]>>(
      ['tip-comment-reports'],
      (old) =>
        old &&
        produce(old, (draft) => {
          draft.pages = draft.pages.map((page) =>
            page.filter((report) => report.id !== id),
          );
        }),
    );
  };

  const onRejectReport = async (id: number) => {
    await axios.post('admin/tip-comment-reports/' + id + '/reject');
    removeFromList(id);
    setOpenDialogIndex(null);
  };

  const onAcceptReport = async (id: number) => {
    await axios.post('admin/tip-comment-reports/' + id + '/accept');
    removeFromList(id);
    setOpenDialogIndex(null);
  };

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage]);

  return (
    <div className="divide-y">
      {tipCommentReports?.pages.map((page) =>
        page.map((report, index) => (
          <TipCommentReportDialog
            key={report.id}
            ref={page.length - 1 === index ? ref : undefined}
            report={report}
            open={openDialogIndex === index}
            onOpenChange={(open) =>
              open ? setOpenDialogIndex(index) : setOpenDialogIndex(null)
            }
            onRejectReport={onRejectReport}
            onAcceptReport={onAcceptReport}
          />
        )),
      )}
    </div>
  );
};

interface TipCommentReportDialogProps {
  report: TipCommentReport;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRejectReport: (id: number) => {};
  onAcceptReport: (id: number) => {};
}

const TipCommentReportDialog = React.forwardRef<
  HTMLButtonElement,
  TipCommentReportDialogProps
>(({ report, open, onOpenChange, onRejectReport, onAcceptReport }, ref) => {
  const t = useTranslations();

  return (
    <Dialog open={open} onOpenChange={onOpenChange} key={report.id}>
      <DialogTrigger asChild>
        <button ref={ref} className="flex w-full justify-between p-2 text-sm">
          <span>{report._count.tipCommentReport}</span>
          <div className="flex">
            {report.reasons.slice(0, 3).map((reason) => (
              <div key={reason.reason}>
                <span>
                  {t(`reports.reasons.${reason.reason}`)}: {reason._count.reason}
                </span>
              </div>
            ))}
          </div>
        </button>
      </DialogTrigger>
      <DialogContent className="!max-w-2xl">
        <div className="pointer-events-none">
          <TipComment comment={report} tipId={report.tipId} />
        </div>
        <div className="flex gap-2 justify-end">
          <Button variant={'destructive'} onClick={() => onRejectReport(report.id)}>
            {t('admin.reports.reject-report')}
          </Button>
          <Button onClick={() => onAcceptReport(report.id)}>
            {t('admin.reports.accept-report')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
});

TipCommentReportDialog.displayName = 'TipCommentReportDialog';
