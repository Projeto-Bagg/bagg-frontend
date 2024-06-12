import {
  isDayAvailable,
  isMonthAvailable,
} from '@/app/[locale]/(user)/(auth)/signup/birthdate-validation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getDaysInMonth } from 'date-fns';
import { useTranslations } from 'next-intl';
import React from 'react';
import { FieldValues, SetFieldValue } from 'react-hook-form';

interface BirthdateDayProps extends React.ComponentProps<typeof Select> {
  day: string;
  month: string;
  year: string;
  onValueChange: (...event: any[]) => void;
  setValue: SetFieldValue<FieldValues>;
}

export const BirthdateDay = ({
  setValue,
  day,
  month,
  year,
  onValueChange,
  ...props
}: BirthdateDayProps) => {
  const t = useTranslations();

  return (
    <Select
      value={day}
      onValueChange={(value) => {
        onValueChange(value);

        const currentMonth = month;
        if (!isMonthAvailable(+currentMonth, +year)) {
          setValue('birthdateMonth', '');
        }
      }}
      {...props}
    >
      <SelectTrigger data-test="birthdate-day">
        <SelectValue placeholder={t('signup-edit.day')} />
      </SelectTrigger>
      <SelectContent className="max-h-[400px]">
        {[...Array(getDaysInMonth(new Date(+year, +month)))].map((_, index) => (
          <SelectItem
            disabled={!isDayAvailable(index + 1, +month, +year)}
            key={index + 1}
            value={(index + 1).toString()}
          >
            {index + 1}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
