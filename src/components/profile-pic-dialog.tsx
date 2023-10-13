import React, { ReactNode, createRef, useRef, useState } from 'react';
import axios from '../services/axios';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Cropper, ReactCropperElement } from 'react-cropper';
import { Separator } from './ui/separator';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { useAuth } from '../context/auth-context';
import { DialogClose } from '@radix-ui/react-dialog';
import { MoveLeft } from 'lucide-react';
import { useTranslations } from 'next-intl';
import 'cropperjs/dist/cropper.css';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './ui/alert-dialog';

interface IProfilePicDialog {
  children: ReactNode;
}

export const ProfilePicDialog = ({ children }: IProfilePicDialog) => {
  const [open, setOpen] = useState<boolean>();
  const [img, setImg] = useState<string>();
  const inputRef = useRef<HTMLInputElement>(null);
  const cropperRef = createRef<ReactCropperElement>();
  const auth = useAuth();
  const router = useRouter();
  const t = useTranslations('profile_pic_modal');

  const updatePic = useMutation(
    async (image: File) => {
      const formData = new FormData();
      formData.append('profile-pic', image);

      return await axios.put('/users', formData);
    },
    {
      onSuccess: () => {
        router.reload();
      },
    },
  );

  const deletePic = useMutation(
    async () => {
      return await axios.delete('/users/profile-pic');
    },
    {
      onSuccess: () => {
        router.reload();
      },
    },
  );

  const handleImageSubmit = async () => {
    const cropper = cropperRef.current?.cropper;

    if (!cropper) {
      return;
    }

    const url = cropper.getCroppedCanvas().toDataURL('image/jpeg', 0.85);
    const response = await fetch(url);
    const buffer = await response.arrayBuffer();

    const file = new File([buffer], 'output.jpg', { type: 'image/jpg' });

    updatePic.mutate(file);
  };

  const handleDeletePic = () => {
    deletePic.mutate();
  };

  const handleGoBack = () => {
    setImg(undefined);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setImg(undefined);
        setOpen(open);
      }}
    >
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent className="gap-0 px-0 py-0 pt-6">
        <DialogHeader className="mb-6">
          <DialogTitle className="text-center">{t('title')}</DialogTitle>
        </DialogHeader>

        {img ? (
          <div className="px-4 pb-4">
            <button
              onClick={handleGoBack}
              className="absolute left-4 top-4 opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none"
            >
              <MoveLeft size={18} />
            </button>
            <Cropper
              ref={cropperRef}
              style={{ width: '100%', maxHeight: '400px' }}
              initialAspectRatio={1}
              aspectRatio={1}
              center
              src={img}
              viewMode={1}
              cropBoxMovable
              rotatable
              minCropBoxHeight={10}
              minCropBoxWidth={10}
              background={false}
              responsive={true}
              autoCropArea={1}
              checkOrientation={false}
              guides={true}
            />
            <Separator className="my-3" />
            <Button onClick={handleImageSubmit} className="w-full">
              {t('confirm')}
            </Button>
          </div>
        ) : (
          <>
            <Separator />
            <button className="h-[54px]" onClick={() => inputRef.current?.click()}>
              <span className="text-blue-500 font-bold">{t('upload')}</span>
              <Input
                className="hidden"
                type="file"
                accept="image/jpeg,image/png"
                onChange={(e) => {
                  const file = e.currentTarget.files?.[0];

                  if (!file) {
                    return;
                  }

                  var reader = new FileReader();
                  reader.readAsDataURL(file);
                  reader.onload = () => setImg(reader.result as string);
                }}
                ref={inputRef}
              />
            </button>
            <Separator />
            <AlertDialog>
              <AlertDialogTrigger>
                <button className="h-[54px]" disabled={!auth.user?.image}>
                  <span className="text-red-500 font-bold">{t('remove')}</span>{' '}
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Remover foto de perfil</AlertDialogTitle>
                </AlertDialogHeader>
                <span>Tem certeza que deseja remover sua foto de perfil?</span>
                <Separator />
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <Button onClick={handleDeletePic} variant={'destructive'}>
                    Remover
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <Separator />
            <DialogClose className="h-[54px]">
              <span>{t('cancel')}</span>
            </DialogClose>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
