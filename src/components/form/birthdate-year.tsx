import {
  isDayAvailable,
  isMonthAvailable,
} from '@/app/[locale]/(auth)/signup/birthdate-validation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useTranslations } from 'next-intl';
import React from 'react';
import { FieldValues, SetFieldValue } from 'react-hook-form';

interface BirthdateYearProps extends React.ComponentProps<typeof Select> {
  day: string;
  month: string;
  year: string;
  onValueChange: (...event: any[]) => void;
  setValue: SetFieldValue<FieldValues>;
}

export const BirthdateYear = ({
  setValue,
  day,
  month,
  year,
  onValueChange,
  ...props
}: BirthdateYearProps) => {
  const t = useTranslations();

  return (
    <Select
      value={year}
      onValueChange={(value) => {
        onValueChange(value);

        const currentDay = day;
        if (!isDayAvailable(+currentDay, +month, +year)) {
          setValue('birthdateDay', '');
        }

        const currentMonth = month;
        if (!isMonthAvailable(+currentMonth, +year)) {
          setValue('birthdateMonth', '');
        }
      }}
      {...props}
    >
      <SelectTrigger data-test="birthdate-year">
        <SelectValue placeholder={t('signup-edit.year')} />
      </SelectTrigger>
      <SelectContent className="max-h-[400px]">
        {Array.apply(0, Array(104 - 1))
          .map((_, index) => new Date().getFullYear() - index - 16)
          .map((year, index) => (
            <SelectItem key={index} value={year.toString()}>
              {year}
            </SelectItem>
          ))}
      </SelectContent>
    </Select>
  );
};
