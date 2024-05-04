'use client';

import { DiaryPost } from '@/components/posts/diary-post';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import axios from '@/services/axios';
import { useInfiniteQuery } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';

export const DiaryPostReports = () => {
  const [openDialogIndex, setOpenDialogIndex] = useState<number | null>(null);
  const { ref, inView } = useInView();

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

  const onRejectReport = async (id: number) => {
    await axios.post('admin/diary-post-reports/' + id + '/reject');
    setOpenDialogIndex(null);
  };

  const onAcceptReport = async (id: number) => {
    await axios.post('admin/diary-post-reports/' + id + '/accept');
    setOpenDialogIndex(null);
  };

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage]);

  return (
    <div>
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
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger>
        <button ref={ref} className="flex w-full justify-between p-2">
          <span>{report._count.diaryPostReport}</span>
          <div className="flex">
            {report.reasons.slice(0, 3).map((reason, index) => (
              <div key={index}>
                <span>
                  {reason.reason}: {reason._count.reason}
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
          <Button variant={'destructive'} onClick={() => onRejectReport(report.id)}>
            Rejeitar denúncia
          </Button>
          <Button onClick={() => onAcceptReport(report.id)}>Aceitar denúncia</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
});

DiaryPostReportDialog.displayName = 'DiaryPostReportDialog';
