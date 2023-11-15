'use client';

import NextImage from 'next/image';
import React, { ReactNode, useRef, useState } from 'react';
import { CreateTripDiary } from '@/components/create-trip-diary';
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
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useAuth } from '@/context/auth-context';
import { useCreateDiaryPost } from '@/hooks/useCreateDiaryPost';
import { cn } from '@/lib/utils';
import axios from '@/services/axios';
import { getVideoThumbnail } from '@/utils/getVideoThumbnail';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { Check, ChevronsUpDown, Info, Trash2 } from 'lucide-react';
import { useFormatter, useTranslations } from 'next-intl';
import { Image as ImageIcon } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';

const CreateDiaryPostSchema = z.object({
  tripDiaryId: z.number(),
  message: z.string().nonempty().max(300),
  medias: z
    .array(z.object({ file: z.instanceof(File), thumbnail: z.string() }))
    .max(10)
    .optional(),
});

export type CreateDiaryPostType = z.infer<typeof CreateDiaryPostSchema>;

export const CreatePost = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState<boolean>();
  const formatter = useFormatter();
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const t = useTranslations();
  const createDiaryPost = useCreateDiaryPost();
  const imageInputFile = useRef<HTMLInputElement>(null);
  const {
    control,
    register,
    handleSubmit,
    setValue,
    watch,
    getValues,
    setError,
    reset,
    formState: { errors },
  } = useForm<CreateDiaryPostType>({
    resolver: zodResolver(CreateDiaryPostSchema),
  });

  const tripDiaries = useQuery<TripDiary[]>({
    queryFn: async () =>
      (await axios.get<TripDiary[]>('/tripDiaries/user/' + auth.user?.username)).data,
    queryKey: ['tripDiaries', auth.user?.username],
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
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        onInteractOutside={(e) => createDiaryPost.isPending && e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>{t('createPost.title')}</DialogTitle>
        </DialogHeader>
        <div>
          <div className="flex justify-between">
            <div>
              <Label className="mr-2">{t('createPost.tripDiary')}</Label>
              <CreateTripDiary>
                <span className="text-primary text-sm font-bold">
                  {t('createPost.createTripDiary')}
                </span>
              </CreateTripDiary>
            </div>
            {errors.tripDiaryId && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info size={18} className="text-red-600" />
                </TooltipTrigger>
                <TooltipContent>{t('createPost.tripDiaryError')}</TooltipContent>
              </Tooltip>
            )}
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outlineNoHover"
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
                  : t('createPost.selectTripDiary')}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
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
                        <Check
                          className={cn(
                            'mr-2 h-4 w-4',
                            watch('tripDiaryId') === tripDiary.id
                              ? 'opacity-100'
                              : 'opacity-0',
                          )}
                        />
                        <div className="flex items-end justify-between w-full gap-2">
                          <span>{tripDiary.title}</span>
                          <span className="text-xs">
                            {formatter.dateTime(tripDiary.createdAt, {
                              timeZone: 'America/Sao_Paulo',
                            })}
                          </span>
                        </div>
                      </CommandItem>
                    ))
                  ) : (
                    <CommandItem>{t('createPost.noTripDiariesFound')}</CommandItem>
                  )}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit(handleCreatePost)}>
          <div>
            <div className="flex justify-between mb-0.5">
              <div className="flex gap-1 items-end">
                <Label>{t('createPost.message')}</Label>
                <Label className="text-muted-foreground text-xs">
                  {watch('message')?.length || 0} / 300
                </Label>
              </div>
              {errors.message && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info size={18} className="text-red-600" />
                  </TooltipTrigger>
                  <TooltipContent>
                    {errors.message.type === 'too_big'
                      ? t('createPost.messageMaxError')
                      : t('createPost.messageError')}
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
            <Textarea {...register('message')} className="max-h-[160px]" />
          </div>
          {watch('medias') && watch('medias')!.length > 0 && (
            <ScrollArea className="w-96 md:w-[462px] whitespace-nowrap rounded-md border">
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
                      const currentImages = getValues('medias');
                      const currentImagesSize =
                        currentImages?.reduce((acc, curr) => acc + curr.file.size, 0) ||
                        0;
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
                          title: t('createPost.maxSizeFiles'),
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
              {t('createPost.confirm')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
