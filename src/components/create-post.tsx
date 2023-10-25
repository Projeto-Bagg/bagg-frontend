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
  DialogFooter,
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
import NextImage from 'next/image';
import React, { ReactNode, useState } from 'react';
import Dropzone from 'react-dropzone';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

const CreateDiaryPostSchema = z.object({
  tripDiaryId: z.number(),
  title: z.string(),
  message: z.string().nonempty(),
  medias: z
    .array(z.object({ file: z.instanceof(File), thumbnail: z.string() }))
    .optional(),
});

export type CreateDiaryPostType = z.infer<typeof CreateDiaryPostSchema>;

export const CreatePost = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState<boolean>();
  const formatter = useFormatter();
  const auth = useAuth();
  const t = useTranslations();
  const {
    control,
    register,
    handleSubmit,
    setValue,
    watch,
    getValues,
    formState: { errors },
  } = useForm<CreateDiaryPostType>({
    resolver: zodResolver(CreateDiaryPostSchema),
  });

  console.log(errors);

  const createDiaryPost = useCreateDiaryPost();

  const tripDiaries = useQuery<TripDiary[]>(
    ['tripDiaries', auth.user?.username],
    async () =>
      (await axios.get<TripDiary[]>('/tripDiaries/user/' + auth.user?.username)).data,
    {
      enabled: !!open,
    },
  );

  const handleCreatePost = async (data: CreateDiaryPostType) => {
    const formData = new FormData();

    data.medias && data.medias.forEach((media) => formData.append('medias', media.file));
    formData.append('title', data.title);
    formData.append('message', data.message);
    formData.append('tripDiaryId', data.tripDiaryId.toString());

    await createDiaryPost.mutateAsync(formData);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('createPost.title')}</DialogTitle>
        </DialogHeader>
        <div>
          <div className="flex justify-between">
            <div>
              <Label className="mr-2">{t('createPost.tripDiary')} *</Label>
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
                        <div className="flex justify-between w-full">
                          <span>{tripDiary.title}</span>
                          <span>
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
            <div className="justify-between flex mb-0.5">
              <Label>{t('createPost.titleField')}</Label>
              {errors.title && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info size={18} className="text-red-600" />
                  </TooltipTrigger>
                  <TooltipContent>{t('createPost.titleFieldError')}</TooltipContent>
                </Tooltip>
              )}
            </div>
            <Input {...register('title')} />
          </div>
          <div>
            <div className="flex justify-between mb-0.5">
              <Label>{t('createPost.message')} *</Label>
              {errors.message && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info size={18} className="text-red-600" />
                  </TooltipTrigger>
                  <TooltipContent>{t('createPost.messageError')}</TooltipContent>
                </Tooltip>
              )}
            </div>
            <Textarea {...register('message')} className="max-h-[160px]" />
          </div>
          {!watch('medias') || watch('medias')?.length === 0 ? (
            <Controller
              name="medias"
              control={control}
              render={({ field }) => (
                <Dropzone
                  maxFiles={10}
                  accept={{
                    'video/mp4': [],
                    'image/jpeg': [],
                    'image/png': [],
                    'image/webp': [],
                  }}
                  onDropAccepted={async (files) => {
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
                      ),
                    );
                  }}
                  onDropRejected={() => {
                    field.onChange(null);
                  }}
                  maxSize={104857600}
                >
                  {({ getRootProps, fileRejections }) => (
                    <div
                      className="flex justify-center align-center flex-col w-full h-[140px] border-2 border-dashed mt-4 rounded-md p-3 cursor-pointer"
                      {...getRootProps()}
                    >
                      <div className="flex flex-col align-center gap-1 text-center">
                        {fileRejections.length !== 0 && (
                          <span>{t('createPost.dropzoneError')}</span>
                        )}
                        <Label>{t('createPost.dropzoneMessage')}</Label>
                        <Label>{t('createPost.dropzoneLimit')}</Label>
                      </div>
                    </div>
                  )}
                </Dropzone>
              )}
            />
          ) : (
            <ScrollArea className="w-96 md:w-[462px] whitespace-nowrap rounded-md border">
              <div className="w-max flex justify-center gap-2 ">
                {watch('medias')?.map((file) => (
                  <div
                    className="overflow-hidden relative w-[110px]"
                    key={file.file.name}
                  >
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
          <DialogFooter>
            <Button type="submit">{t('createPost.confirm')}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
