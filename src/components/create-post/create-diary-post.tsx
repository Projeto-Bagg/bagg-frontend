'use client';

import React, { ReactNode, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { useCreateDiaryPost } from '@/hooks/diary-post';
import { cn } from '@/lib/utils';
import axios from '@/services/axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { ChevronsUpDown, Plus, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { CreateTripDiary } from '@/components/create-post/create-trip-diary';
import { CountryFlag } from '@/components/ui/country-flag';
import { useAuth } from '@/context/auth-context';
import { CreatePostMedias } from '@/components/create-post/create-post-medias';
import { MediaInput } from '@/components/create-post/media-input';
import { useRouter } from '@/common/navigation';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

const createDiaryPostSchema = z.object({
  tripDiaryId: z.number(),
  message: z.string().min(1).max(300),
  medias: z
    .array(
      z.object({
        file: z.any(),
        thumbnail: z.string(),
      }),
    )
    .max(10),
});

export type CreateDiaryPostType = z.infer<typeof createDiaryPostSchema>;

export const CreateDiaryPost = () => {
  const [open, setOpen] = useState<boolean>();
  const [isCreatingTripDiary, setIsCreatingTripDiary] = useState<boolean>(false);
  const router = useRouter();
  const t = useTranslations();
  const createDiaryPost = useCreateDiaryPost();
  const {
    control,
    register,
    handleSubmit,
    setValue,
    watch,
    setError,
    reset,
    formState: { errors, dirtyFields },
  } = useForm<CreateDiaryPostType>({
    resolver: zodResolver(createDiaryPostSchema),
    mode: 'onChange',
    defaultValues: {
      message: '',
      medias: [],
    },
  });

  const handleCreateDiaryPost = async (data: CreateDiaryPostType) => {
    const formData = new FormData();

    data.medias.length &&
      data.medias.forEach((media) => formData.append('medias', media.file));
    formData.append('message', data.message);
    formData.append('tripDiaryId', data.tripDiaryId.toString());

    const post = await createDiaryPost.mutateAsync(formData);

    setOpen(false);
    router.push({ params: { slug: post.tripDiary.id }, pathname: '/diary/[slug]' });
    reset(undefined, { keepDefaultValues: true });
  };

  const onOpenChange = (open: boolean) => {
    if (open) {
      reset(undefined, { keepDefaultValues: true });
      return setOpen(true);
    }

    if (!open && isCreatingTripDiary) {
      return setIsCreatingTripDiary(false);
    }

    if (Object.entries(dirtyFields).length) {
      const shouldClose = window.confirm(t('modal.close'));
      if (!shouldClose) return;
    }

    setOpen(false);
    setIsCreatingTripDiary(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <button
              data-test="create-post"
              className="text-primary-foreground flex gap-1 h-[1.2rem] px-2 bg-primary items-center rounded-sm"
            >
              <Plus size={14} strokeWidth={3} />
              <span className="font-bold text-xs uppercase">
                {t('create-post.trigger')}
              </span>
            </button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>{t('create-post.description').split('.')[0]}</TooltipContent>
      </Tooltip>
      <DialogContent
        onInteractOutside={(e) => createDiaryPost.isPending && e.preventDefault()}
      >
        {isCreatingTripDiary && (
          <CreateTripDiary
            onCreate={(tripDiaryId) => setValue('tripDiaryId', tripDiaryId)}
            setIsCreatingTripDiary={setIsCreatingTripDiary}
          />
        )}
        {!isCreatingTripDiary && (
          <>
            <DialogHeader>
              <DialogTitle>{t('create-post.title')}</DialogTitle>
              <DialogDescription>{t('create-post.description')}</DialogDescription>
            </DialogHeader>
            <div>
              <div>
                <Label className="mr-1">{t('create-post.trip-diary')}</Label>
                <button
                  data-test="create-trip-diary-button"
                  onClick={() => setIsCreatingTripDiary(true)}
                  className="text-primary text-sm font-bold"
                >
                  {t('create-post.create-trip-diary')}
                </button>
              </div>
              <SelectTripDiary
                onSelect={(tripDiary) => {
                  setValue('tripDiaryId', tripDiary.id, {
                    shouldDirty: true,
                  });
                }}
                value={watch('tripDiaryId')}
              />
              {errors.tripDiaryId && (
                <span className="text-sm text-red-600 font-semibold">
                  {t('create-post.trip-diary-error')}
                </span>
              )}
            </div>
            <form
              data-test="create-post-form"
              className="space-y-4"
              onSubmit={handleSubmit(handleCreateDiaryPost)}
            >
              <div>
                <div className="flex justify-between mb-0.5">
                  <Label className="mr-1">{t('create-post.message')}</Label>
                  <Label className="text-muted-foreground text-xs">
                    {watch('message')?.length || 0} / 300
                  </Label>
                </div>
                <Textarea {...register('message')} className="max-h-[160px]" />
                {errors.message && (
                  <span className="text-sm text-red-600 font-semibold">
                    {errors.message.type === 'too_big'
                      ? t('create-post.message-max-error')
                      : t('create-post.message-error')}
                  </span>
                )}
              </div>
              <CreatePostMedias medias={watch('medias')} setValue={setValue} />
              <div className="flex justify-between">
                <Controller
                  control={control}
                  name="medias"
                  render={({ field }) => (
                    <MediaInput
                      medias={watch('medias')}
                      onChange={field.onChange}
                      setError={setError}
                    />
                  )}
                />
                <Button
                  loading={createDiaryPost.isPending}
                  disabled={createDiaryPost.isPending}
                  type="submit"
                >
                  {t('create-post.confirm')}
                </Button>
              </div>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

interface SelectTripDiaryProps {
  onSelect: (tripDiary: TripDiary) => void;
  value: number;
}

const SelectTripDiary = ({ onSelect, value }: SelectTripDiaryProps) => {
  const auth = useAuth();
  const t = useTranslations();
  const [open, setOpen] = useState<boolean>();

  const tripDiaries = useQuery<TripDiary[]>({
    queryFn: async () =>
      (await axios.get<TripDiary[]>('/trip-diaries/user/' + auth.user?.username)).data,
    queryKey: ['trip-diaries', auth.user?.username],
  });

  const selectedTripDiary = tripDiaries.data?.find((tripDiary) => tripDiary.id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          data-test="select-trip-diary"
          variant="outline-ring"
          role="combobox"
          className={cn(
            'w-full justify-between',
            !selectedTripDiary && 'text-muted-foreground',
          )}
        >
          {selectedTripDiary ? (
            <div className="flex gap-1">
              <CountryFlag
                className="shrink-0"
                iso2={selectedTripDiary.city.region.country.iso2}
              />
              <div className="flex max-w-[216px]">
                <div className="whitespace-nowrap">
                  <span className="mr-1">{selectedTripDiary.title}</span>
                </div>
                <span className="text-muted-foreground text-ellipsis whitespace-nowrap overflow-hidden">
                  {selectedTripDiary.city.name}
                </span>
              </div>
            </div>
          ) : (
            t('create-post.select-trip-diary')
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <Command shouldFilter={false}>
          <CommandInput placeholder="Procurar..." />
          <CommandGroup>
            {tripDiaries.data && tripDiaries.data.length > 0 ? (
              tripDiaries.data.map((tripDiary) => (
                <CommandItem
                  value={tripDiary.title}
                  key={tripDiary.id}
                  onSelect={() => {
                    onSelect(tripDiary);
                    setOpen(false);
                  }}
                  className="gap-1"
                >
                  <span
                    className={cn(
                      'mr-1 flex h-[18px] shrink-0 w-[18px] items-center justify-center',
                      selectedTripDiary?.id === tripDiary.id
                        ? 'opacity-100'
                        : 'opacity-0',
                    )}
                  >
                    <span className="w-[3px] h-full rounded-xl bg-primary" />
                  </span>
                  <CountryFlag
                    className="shrink-0"
                    iso2={tripDiary.city.region.country.iso2}
                  />
                  <div className="flex max-w-[216px]">
                    <div className="whitespace-nowrap">
                      <span className="mr-1">{tripDiary.title}</span>
                    </div>
                    <span className="text-muted-foreground text-ellipsis whitespace-nowrap overflow-hidden">
                      {tripDiary.city.name}
                    </span>
                  </div>
                </CommandItem>
              ))
            ) : (
              <CommandItem>{t('create-post.no-trip-diaries-found')}</CommandItem>
            )}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
