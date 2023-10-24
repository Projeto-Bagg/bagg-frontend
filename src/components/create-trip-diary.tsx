import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useCreateTripDiary } from '@/hooks/useCreateTripDiary';
import { zodResolver } from '@hookform/resolvers/zod';
import { Info } from 'lucide-react';
import { useTranslations } from 'next-intl';
import React, { ReactNode, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const createTripDiarySchema = z.object({
  title: z.string().min(3),
  message: z.string(),
});

export type CreateTripDiaryType = z.infer<typeof createTripDiarySchema>;

export const CreateTripDiary = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState<boolean>();
  const createTripDiary = useCreateTripDiary();
  const t = useTranslations();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateTripDiaryType>({
    resolver: zodResolver(createTripDiarySchema),
  });

  const handleCreateTripDiary = (data: CreateTripDiaryType) => {
    createTripDiary.mutateAsync(data).then(() => setOpen(false));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="text-primary">{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('createTripDiary.title')}</DialogTitle>
          <DialogDescription>{t('createTripDiary.description')}</DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit(handleCreateTripDiary)}>
          <div>
            <div className="justify-between flex mb-0.5">
              <Label>{t('createTripDiary.titleField')}</Label>
              {errors.title && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info size={18} className="text-red-600" />
                  </TooltipTrigger>
                  <TooltipContent>{t('createTripDiary.titleFieldError')}</TooltipContent>
                </Tooltip>
              )}
            </div>
            <Input {...register('title')} />
          </div>
          <div>
            <div className="justify-between flex mb-0.5">
              <Label>{t('createTripDiary.message')}</Label>
              {errors.message && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info size={18} className="text-red-600" />
                  </TooltipTrigger>
                  <TooltipContent>{t('createTripDiary.messageError')}</TooltipContent>
                </Tooltip>
              )}
            </div>
            <Textarea {...register('message')} className="max-h-[160px]" />
          </div>
          <DialogFooter>
            <Button type="submit">{t('createTripDiary.message')}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
