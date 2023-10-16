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
  const auth = useAuth();
  const t = useTranslations('profilePicModal');

  const handleZoom = useCallback((e: Cropper.ZoomEvent<HTMLImageElement>) => {
    const height = cropperRef.current?.naturalHeight;
    const width = cropperRef.current?.naturalWidth;

    if (!height || !width) {
      return;
    }

    const minZoom = 510 / (width < height ? width : height);

    setMinZoom(minZoom);

    if (e.detail.oldRatio > e.detail.ratio && e.detail.ratio < minZoom) {
      setZoom(minZoom);
    }

    if (e.detail.ratio > 2) {
      setZoom(2);
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

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
        setImg(undefined);
      }}
    >
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent className="gap-0 px-0 py-0 pt-6">
        <DialogHeader className="mb-6">
          <DialogTitle className="text-center">{t('title')}</DialogTitle>
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
                className={`w-full h-[100vw] aspect-square lg:w-full lg:h-[510px]`}
                ref={cropperRef}
                center
                zoom={handleZoom}
                zoomTo={zoom}
                src={img}
                viewMode={3}
                cropBoxResizable={false}
                wheelZoomRatio={0.1}
                background={false}
                autoCropArea={1}
                guides={true}
              ></Cropper>
              <div className="absolute right-4 bottom-4 w-[45%] bg-slate-700 border-muted-foreground border p-1 bg-opacity-30 rounded-xl flex gap-1.5 text-primary">
                <ZoomOut size={26} strokeWidth={2.5} />
                <Slider
                  min={minZoom}
                  max={2}
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
                {t('confirm')}
              </Button>
            </div>
          </div>
        ) : (
          <>
            <Separator />
            <button className="h-[54px]" onClick={() => inputRef.current?.click()}>
              <span className="text-blue-500 font-bold">{t('upload')}</span>
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
              <span className="text-red-500 font-bold">{t('remove')}</span>{' '}
            </button>
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
