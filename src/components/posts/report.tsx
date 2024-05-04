import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/use-toast';
import axios from '@/services/axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { Label } from '@radix-ui/react-label';
import { useTranslations } from 'next-intl';
import React, { ReactNode, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

interface ReportProps {
  children: ReactNode;
  id: number;
  reportType: 'tip' | 'diary-post' | 'tip-comment';
}

const reasons = [
  'hate',
  'violent-speech',
  'spam',
  'nudity',
  'false-information',
] as const;

const reportSchema = z.object({
  reason: z.enum(reasons),
});

type ReportType = z.infer<typeof reportSchema>;

export const Report = ({ children, id, reportType }: ReportProps) => {
  const t = useTranslations();
  const [open, setOpen] = useState<boolean>();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ReportType>({
    resolver: zodResolver(reportSchema),
  });

  const onReport = async (data: ReportType) => {
    try {
      if (reportType === 'tip') {
        await axios.post('tips/report/' + id, {
          reason: data.reason,
        });
      }
      if (reportType === 'tip-comment') {
        await axios.post('tip-comments/report/' + id, {
          reason: data.reason,
        });
      }

      if (reportType === 'diary-post') {
        await axios.post('diary-posts/report/' + id, {
          reason: data.reason,
        });
      }

      toast({ variant: 'success', title: 'Denúncia realizada com sucesso!' });
      reset();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Houve um erro ao realizar a denúncia. Tente novamente mais tarde',
      });
    } finally {
      setOpen(false);
    }
  };

  const onOpenChange = (open: boolean) => {
    reset();
    setOpen(open);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reportar</DialogTitle>
        </DialogHeader>
        <h2 className="font-semibold">Qual o motivo da denúncia?</h2>
        <form data-test="report-form" onSubmit={handleSubmit(onReport)}>
          <Controller
            name="reason"
            control={control}
            render={({ field }) => (
              <RadioGroup onValueChange={field.onChange}>
                {reasons.map((reason) => (
                  <div key={reason} className="flex items-center space-x-2">
                    <RadioGroupItem value={reason} id={reason} />
                    <Label htmlFor={reason}>{reason}</Label>
                  </div>
                ))}
              </RadioGroup>
            )}
          />
          {errors.reason && (
            <span className="text-sm text-red-600 font-semibold">
              {t('create-post.trip-diary-error')}
            </span>
          )}
          <Button disabled={!!errors.reason} className="w-full mt-4" type="submit">
            Reportar
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
