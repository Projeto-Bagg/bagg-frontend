'use client';

import * as React from 'react';
import { MoonIcon, SunIcon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  PrimitiveSelectTrigger,
} from '@/components/ui/select';
import { useTranslations } from 'next-intl';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

type ThemeType = 'dark' | 'light' | 'system';

export const ThemeToggle = () => {
  const { setTheme, theme: activeTheme, themes } = useTheme();
  const t = useTranslations();

  return (
    <Select defaultValue={activeTheme} onValueChange={(theme) => setTheme(theme)}>
      <Tooltip>
        <TooltipTrigger asChild onFocus={(e) => e.preventDefault()}>
          <PrimitiveSelectTrigger asChild>
            <Button className="hidden sm:flex" variant={'ghost'} size="icon">
              <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>
          </PrimitiveSelectTrigger>
        </TooltipTrigger>
        <TooltipContent>{t('header.themes.title')}</TooltipContent>
      </Tooltip>
      <SelectContent>
        {themes.map((theme) => (
          <SelectItem value={theme} key={theme}>
            {t(`header.themes.${theme as ThemeType}`)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
