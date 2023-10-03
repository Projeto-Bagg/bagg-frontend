import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import Dropzone from 'react-dropzone';
import Image from 'next/image';
import { zodResolver } from '@hookform/resolvers/zod';
import { Textarea } from './ui/textarea';
import { getVideoThumbnail } from '../utils/getVideoThumbnail';
import { useCreateTip } from '../hooks/useCreateTip';

const createTipSchema = z.object({
  file: z.object(
    {
      video: typeof window === 'undefined' ? z.any() : z.instanceof(File),
      thumbnail: z.string(),
    },
    { required_error: 'Selecione um vídeo' }
  ),
  title: z.string(),
  message: z.string(),
});

type CreateTipData = z.infer<typeof createTipSchema>;

export default function CreateTip() {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateTipData>({ resolver: zodResolver(createTipSchema) });

  const createTip = useCreateTip();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Criar tip</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Criar tip</DialogTitle>
          <DialogDescription>
            Preencha o formulário para compartilhar suas melhores experiências com a
            comunidade!
          </DialogDescription>
        </DialogHeader>

        <div>
          <Label>Título</Label>
          <Input {...register('title')} />
        </div>
        <div>
          <Label>Descreva sua viagem</Label>
          <Textarea {...register('message')} className="max-h-[160px]" />
        </div>
        <div>
          <Controller
            name="file"
            control={control}
            render={({ field }) => (
              <Dropzone
                accept={{ 'video/mp4': [] }}
                onDropAccepted={async (files) => {
                  field.onChange({
                    video: files[0],
                    thumbnail: await getVideoThumbnail(files[0]),
                  });
                }}
                onDropRejected={() => {
                  field.onChange(null);
                }}
                maxSize={104857600}
              >
                {({ getRootProps, fileRejections, isDragActive, acceptedFiles }) => (
                  <div
                    className="flex justify-center align-center flex-col w-full h-[140px] border-2 border-dashed border-input mt-4 rounded-md p-3 cursor-pointer"
                    {...getRootProps()}
                  >
                    {field.value ? (
                      <div className="gap-3 flex justify-between w-full">
                        <Image
                          src={field.value.thumbnail}
                          alt=""
                          width={110}
                          height={90}
                          className="object-cover"
                        />
                        <div className="flex-col flex justify-between w-full">
                          <p className="">{field.value.video.name}</p>
                          <div>
                            <span>
                              {(
                                (field.value.video.size / 1048576) *
                                createTip.progress
                              ).toFixed(0)}{' '}
                              MB / {(field.value.video.size / 1048576).toFixed(0)} MB
                            </span>
                            <div className="align-center gap-2 mt-2">
                              <div className="h-2 w-full rounded relative border">
                                <div
                                  data-progress={(createTip.progress * 100).toFixed(0)}
                                  className="h-full absolute top-0 left-0 rounded bg-blue-500 w-[data-[progress]%]"
                                />
                              </div>
                              <span>{(createTip.progress * 100).toFixed(0)}%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col align-center gap-1 text-center">
                        {fileRejections.length !== 0 && <span>Arquivo muito grande</span>}
                        {errors.file && <span color={'red'}>{errors.file.message}</span>}
                        <Label>Arraste um vídeo ou clique para procurar</Label>
                        <Label>Limite de 100 MB</Label>
                      </div>
                    )}
                  </div>
                )}
              </Dropzone>
            )}
          />
        </div>
        <DialogFooter>
          <Button variant={'destructive'}>Cancelar</Button>
          <Button>Enviar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
