'use client';

import { DiaryPost } from '@/components/posts/diary-post';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import axios from '@/services/axios';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { produce } from 'immer';
import { useTranslations } from 'next-intl';
import React, { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';

export const DiaryPostReports = () => {
  const [openDialogIndex, setOpenDialogIndex] = useState<number | null>(null);
  const { ref, inView } = useInView();
  const queryClient = useQueryClient();

  const {
    data: diaryPostReports,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery<DiaryPostReport[]>({
    queryKey: ['diary-post-reports'],
    queryFn: async ({ pageParam }) =>
      (
        await axios.get<DiaryPostReport[]>('/admin/diary-post-reports', {
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
    queryClient.setQueryData<Pagination<DiaryPostReport[]>>(
      ['diary-post-reports'],
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
    await axios.post('admin/diary-post-reports/' + id + '/reject');
    removeFromList(id);
    setOpenDialogIndex(null);
  };

  const onAcceptReport = async (id: number) => {
    await axios.post('admin/diary-post-reports/' + id + '/accept');
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
      {diaryPostReports?.pages.map((page) =>
        page.map((report, index) => (
          <DiaryPostReportDialog
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

interface DiaryPostReportDialogProps {
  report: DiaryPostReport;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRejectReport: (id: number) => {};
  onAcceptReport: (id: number) => {};
}

const DiaryPostReportDialog = React.forwardRef<
  HTMLButtonElement,
  DiaryPostReportDialogProps
>(({ report, open, onOpenChange, onRejectReport, onAcceptReport }, ref) => {
  const t = useTranslations();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <button
          data-test={'diary-post-report-' + report.id}
          ref={ref}
          className="flex w-full justify-between p-2 text-sm"
        >
          <span>{report._count.diaryPostReport}</span>
          <div className="flex">
            {report.reasons.slice(0, 3).map((reason, index) => (
              <div key={index}>
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
          <DiaryPost post={report} />
        </div>
        <div className="flex gap-2 justify-end">
          <Button
            data-test="reject-report"
            variant={'destructive'}
            onClick={() => onRejectReport(report.id)}
          >
            {t('admin.reports.reject-report')}
          </Button>
          <Button data-test="accept-report" onClick={() => onAcceptReport(report.id)}>
            {t('admin.reports.accept-report')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
});

DiaryPostReportDialog.displayName = 'DiaryPostReportDialog';
