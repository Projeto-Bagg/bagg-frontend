'use client';

import { Tip } from '@/components/posts/tip';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import axios from '@/services/axios';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { produce } from 'immer';
import { useTranslations } from 'next-intl';
import React, { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';

export const TipReports = () => {
  const [openDialogIndex, setOpenDialogIndex] = useState<number | null>(null);
  const { ref, inView } = useInView();
  const queryClient = useQueryClient();

  const {
    data: tipReports,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery<TipReport[]>({
    queryKey: ['tip-reports'],
    queryFn: async ({ pageParam }) =>
      (
        await axios.get<TipReport[]>('/admin/tip-reports', {
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
      ['tip-reports'],
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
    await axios.post('admin/tip-reports/' + id + '/reject');
    removeFromList(id);
    setOpenDialogIndex(null);
  };

  const onAcceptReport = async (id: number) => {
    await axios.post('admin/tip-reports/' + id + '/accept');
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
      {tipReports?.pages.map((page) =>
        page.map((report, index) => (
          <TipReportDialog
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

interface TipReportDialogProps {
  report: TipReport;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRejectReport: (id: number) => {};
  onAcceptReport: (id: number) => {};
}
const TipReportDialog = React.forwardRef<HTMLButtonElement, TipReportDialogProps>(
  ({ report, open, onOpenChange, onRejectReport, onAcceptReport }, ref) => {
    const t = useTranslations();

    return (
      <Dialog open={open} onOpenChange={onOpenChange} key={report.id}>
        <DialogTrigger asChild>
          <button ref={ref} className="flex w-full justify-between p-2 text-sm">
            <span>{report._count.tipReport}</span>
            <div className="flex gap-1">
              {report.reasons.slice(0, 2).map((reason) => (
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
            <Tip tip={report} />
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
  },
);

TipReportDialog.displayName = 'TipReportDialog';
