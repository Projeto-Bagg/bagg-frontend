'use client';

import React, { ReactNode, useCallback, useRef, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Cropper, ReactCropperElement } from 'react-cropper';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/auth-context';
import { DialogClose } from '@radix-ui/react-dialog';
import { MoveLeft, ZoomIn, ZoomOut } from 'lucide-react';
import { useTranslations } from 'next-intl';
import 'cropperjs/dist/cropper.css';
import { Slider } from '@/components/ui/slider';

interface IProfilePicDialog {
  children: ReactNode;
  onSubmit: (submit: { file: File; url: string } | null) => void;
}

export const ProfilePicDialog = ({ children, onSubmit }: IProfilePicDialog) => {
  const [open, setOpen] = useState<boolean>();
  const [img, setImg] = useState<string>();
  const [zoom, setZoom] = useState<number>();
  const [minZoom, setMinZoom] = useState<number>();
  const inputRef = useRef<HTMLInputElement>(null);
  const cropperRef = useRef<ReactCropperElement>(null);
  const modalRef = useRef<React.ElementRef<typeof DialogContent>>(null);
  const auth = useAuth();
  const t = useTranslations();

  const handleZoom = useCallback((e: Cropper.ZoomEvent<HTMLImageElement>) => {
    const height = cropperRef.current?.naturalHeight;
    const width = cropperRef.current?.naturalWidth;
    const modalWidth = modalRef.current?.offsetWidth;

    if (!height || !width || !modalWidth) {
      return;
    }

    const minZoom = modalWidth / (width < height ? width : height);
    setMinZoom(minZoom);

    if (e.detail.oldRatio > e.detail.ratio && e.detail.ratio < minZoom) {
      setZoom(minZoom);
    }

    if (e.detail.ratio > minZoom * 2.5) {
      setZoom(minZoom * 2.5);
      e.preventDefault();
    } else {
      setZoom(e.detail.ratio);
    }
  }, []);

  const handleImageSubmit = async () => {
    const cropper = cropperRef.current?.cropper;

    if (!cropper) {
      return;
    }

    const url = cropper.getCroppedCanvas().toDataURL('image/jpeg', 0.85);
    const response = await fetch(url);
    const buffer = await response.arrayBuffer();

    const file = new File([buffer], 'output.jpg', { type: 'image/jpg' });

    onSubmit({ file, url });
    setOpen(false);
  };

  const handleDeletePic = async () => {
    onSubmit(null);
    setOpen(false);
  };

  const handleGoBack = () => {
    setImg(undefined);
    setMinZoom(undefined);
    setZoom(undefined);
  };

  const onOpenChange = (open: boolean) => {
    if (open) {
      return setOpen(true);
    }

    if (img) {
      const shouldClose = window.confirm(t('modal.close'));
      if (!shouldClose) return;
    }

    setOpen(false);
    setImg(undefined);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent ref={modalRef} className="gap-0 p-0 sm:p-0 pt-6 sm:pt-6">
        <DialogHeader className="mb-6">
          <DialogTitle className="text-center">
            {t('profile-pic-modal.title')}
          </DialogTitle>
        </DialogHeader>

        {img ? (
          <div className="pb-4">
            <button
              onClick={handleGoBack}
              className="absolute left-4 top-4 opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none"
            >
              <MoveLeft size={18} />
            </button>
            <div className="relative">
              <Cropper
                className={`w-screen h-[100vw] sm:w-full sm:h-[510px]`}
                ref={cropperRef}
                center
                zoom={handleZoom}
                zoomTo={zoom}
                src={img}
                viewMode={3}
                background={false}
                wheelZoomRatio={0.1}
                initialAspectRatio={1}
                aspectRatio={1}
                autoCropArea={1}
                responsive
                restore
                guides={true}
              ></Cropper>
              <div className="absolute right-4 bottom-4 w-[50%] bg-slate-700 border-muted-foreground border p-1 bg-opacity-30 rounded-xl flex gap-1.5 text-primary">
                <ZoomOut size={26} strokeWidth={2.5} />
                <Slider
                  min={minZoom}
                  max={(minZoom || 1) * 2.5}
                  value={[zoom || 0]}
                  onValueChange={(zoom) => setZoom(zoom[0])}
                  step={0.01}
                />
                <ZoomIn size={26} strokeWidth={2.5} />
              </div>
            </div>
            <div className="px-4">
              <Separator className="my-3" />
              <Button onClick={handleImageSubmit} className="w-full">
                {t('profile-pic-modal.confirm')}
              </Button>
            </div>
          </div>
        ) : (
          <>
            <Separator />
            <button className="h-[54px]" onClick={() => inputRef.current?.click()}>
              <span className="text-blue-500 font-bold">
                {t('profile-pic-modal.upload')}
              </span>
              <Input
                className="hidden"
                type="file"
                accept="image/jpeg,image/png,image/webp"
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
            <button
              className="h-[54px]"
              onClick={handleDeletePic}
              disabled={!auth.user?.image}
            >
              <span className="text-red-500 font-bold">
                {t('profile-pic-modal.remove')}
              </span>{' '}
            </button>
            <Separator />
            <DialogClose className="h-[54px]">
              <span>{t('profile-pic-modal.cancel')}</span>
            </DialogClose>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
