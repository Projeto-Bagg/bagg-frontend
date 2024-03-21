'use client';

import NextImage from 'next/image';
import React, { ReactNode, useRef, useState } from 'react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { useCreateDiaryPost } from '@/hooks/useCreateDiaryPost';
import { cn } from '@/lib/utils';
import axios from '@/services/axios';
import { getVideoThumbnail } from '@/utils/getVideoThumbnail';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { ChevronsUpDown, Info, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Image as ImageIcon } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import { CreateTripDiary } from '@/components/create-trip-diary';
import { CountryFlag } from '@/components/ui/country-flag';
import { useAuth } from '@/context/auth-context';

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
    .max(10)
    .optional(),
});

export type CreateDiaryPostType = z.infer<typeof createDiaryPostSchema>;

export const CreatePost = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState<boolean>();
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const t = useTranslations();
  const createDiaryPost = useCreateDiaryPost();
  const imageInputFile = useRef<HTMLInputElement>(null);
  const [isCreatingTripDiary, setIsCreatingTripDiary] = useState<boolean>(false);
  const {
    control,
    register,
    handleSubmit,
    setValue,
    watch,
    getValues,
    setError,
    reset,
    formState: { errors, isDirty, defaultValues },
  } = useForm<CreateDiaryPostType>({
    resolver: zodResolver(createDiaryPostSchema),
    defaultValues: {
      message: '',
    },
  });

  const tripDiaries = useQuery<TripDiary[]>({
    queryFn: async () =>
      (await axios.get<TripDiary[]>('/trip-diaries/user/' + auth.user?.username)).data,
    queryKey: ['trip-diaries', auth.user?.username],
    enabled: !!open,
  });

  const handleCreatePost = async (data: CreateDiaryPostType) => {
    const formData = new FormData();

    data.medias && data.medias.forEach((media) => formData.append('medias', media.file));
    formData.append('message', data.message);
    formData.append('tripDiaryId', data.tripDiaryId.toString());

    const post = await createDiaryPost.mutateAsync(formData);
    setOpen(false);
    router.push('/diary/' + post.tripDiary.id);
    reset(defaultValues, { keepDefaultValues: true });
  };

  const onOpenChange = (open: boolean) => {
    if (open) {
      return setOpen(true);
    }

    if (isDirty) {
      const shouldClose = window.confirm(t('modal.close'));
      if (!shouldClose) return;
    }

    setIsCreatingTripDiary(false);
    setOpen(false);
    reset(defaultValues, { keepDefaultValues: true });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        onInteractOutside={(e) => createDiaryPost.isPending && e.preventDefault()}
      >
        {isCreatingTripDiary && (
          <CreateTripDiary setIsCreatingTripDiary={setIsCreatingTripDiary} />
        )}
        {!isCreatingTripDiary && (
          <>
            <DialogHeader>
              <DialogTitle>{t('create-post.title')}</DialogTitle>
            </DialogHeader>
            <div>
              <div>
                <Label className="mr-1">{t('create-post.trip-diary')}</Label>
                <button
                  onClick={() => setIsCreatingTripDiary(true)}
                  className="text-primary text-sm font-bold"
                >
                  {t('create-post.create-trip-diary')}
                </button>
              </div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline-ring"
                    role="combobox"
                    className={cn(
                      'w-full justify-between',
                      !watch('tripDiaryId') && 'text-muted-foreground',
                    )}
                  >
                    {watch('tripDiaryId')
                      ? tripDiaries.data?.find(
                          (tripDiary) => tripDiary.id === watch('tripDiaryId'),
                        )?.title
                      : t('create-post.select-trip-diary')}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0">
                  <Command>
                    <CommandInput placeholder="Procurar..." />
                    <CommandGroup>
                      {tripDiaries.data && tripDiaries.data.length > 0 ? (
                        tripDiaries.data.map((tripDiary) => (
                          <CommandItem
                            value={tripDiary.title}
                            key={tripDiary.id}
                            className="cursor-pointer"
                            onSelect={() => {
                              setValue('tripDiaryId', tripDiary.id);
                            }}
                          >
                            <span
                              className={cn(
                                'mr-2 flex h-[18px] w-[18px] items-center justify-center',
                                watch('tripDiaryId') === tripDiary.id
                                  ? 'opacity-100'
                                  : 'opacity-0',
                              )}
                            >
                              <span className="w-[3px] h-full rounded-xl bg-primary" />
                            </span>
                            <div className="flex items-end justify-between w-full gap-2">
                              <div className="flex gap-2">
                                <CountryFlag iso2={tripDiary.city.region.country.iso2} />
                                <div className="gap-1 flex">
                                  <span>{tripDiary.title}</span>
                                  <span className="text-muted-foreground">
                                    {tripDiary.city.name}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </CommandItem>
                        ))
                      ) : (
                        <CommandItem>
                          {t('create-post.no-trip-diaries-found')}
                        </CommandItem>
                      )}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              {errors.tripDiaryId && (
                <span className="text-sm text-red-600 font-semibold">
                  {t('create-post.trip-diary-error')}
                </span>
              )}
            </div>
            <form className="space-y-4" onSubmit={handleSubmit(handleCreatePost)}>
              <div>
                <div className="flex justify-between mb-0.5">
                  <div>
                    <Label className="mr-1">{t('create-post.message')}</Label>
                    <Label className="text-muted-foreground text-xs">
                      {watch('message')?.length || 0} / 300
                    </Label>
                  </div>
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
              {watch('medias') && watch('medias')!.length > 0 && (
                <ScrollArea className="w-96 sm:w-[462px] whitespace-nowrap rounded-md border">
                  <div className="w-max flex justify-center gap-2 ">
                    {watch('medias')?.map((file, index) => (
                      <div className="overflow-hidden relative w-[110px]" key={index}>
                        <AspectRatio ratio={1}>
                          <div className="absolute top-1 right-1 z-20 bg-black p-1 rounded-full">
                            <Trash2
                              onClick={() =>
                                setValue(
                                  'medias',
                                  getValues('medias')?.filter(
                                    (media) => media.file.name !== file.file.name,
                                  ),
                                )
                              }
                              size={16}
                              className="text-red-500"
                            />
                          </div>
                          <NextImage
                            src={file.thumbnail}
                            className="object-cover"
                            alt=""
                            fill
                          />
                        </AspectRatio>
                      </div>
                    ))}
                    <ScrollBar orientation="horizontal" />
                  </div>
                </ScrollArea>
              )}
              <div className="flex justify-between">
                <Controller
                  control={control}
                  name="medias"
                  render={({ field }) => (
                    <button
                      disabled={watch('medias')?.length === 10}
                      type="button"
                      onClick={() => imageInputFile.current?.click()}
                    >
                      <ImageIcon className="text-blue-500" size={20} />
                      <Input
                        multiple
                        className="hidden"
                        type="file"
                        accept="image/jpeg,image/png,image/webp,video/mp4"
                        onChange={async (e) => {
                          const maxSize = 104857600;
                          const currentImages = getValues('medias') as {
                            file: File;
                            thumbnail: string;
                          }[];
                          const currentImagesSize =
                            currentImages?.reduce(
                              (acc, curr) => acc + curr.file.size,
                              0,
                            ) || 0;
                          const files = Array.from(e.target.files as ArrayLike<File>);
                          const newImagesSize = files.reduce(
                            (acc, curr) => acc + curr.size,
                            0,
                          );

                          if (
                            newImagesSize > maxSize - currentImagesSize ||
                            files.length > 10 - (currentImages?.length || 0)
                          ) {
                            setError('medias', {
                              message: 'Max size is 100mb and 10 files',
                              type: 'max',
                            });
                            toast({
                              title: t('create-post.max-size-files'),
                            });
                            return;
                          }

                          field.onChange(
                            await Promise.all(
                              files.map(async (file) => {
                                return {
                                  file,
                                  thumbnail: file.type.startsWith('video')
                                    ? await getVideoThumbnail(file)
                                    : URL.createObjectURL(file),
                                };
                              }),
                            ).then((arr) => arr.concat(currentImages || [])),
                          );
                        }}
                        ref={imageInputFile}
                      />
                    </button>
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
