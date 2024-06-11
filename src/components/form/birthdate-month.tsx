import {
  isDayAvailable,
  isMonthAvailable,
} from '@/app/[locale]/(user)/(auth)/signup/birthdate-validation';
import { months } from '@/common/months';
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

interface BirthdateMonthProps extends React.ComponentProps<typeof Select> {
  day: string;
  month: string;
  year: string;
  onValueChange: (...event: any[]) => void;
  setValue: SetFieldValue<FieldValues>;
}

export const BrithdateMonth = ({
  setValue,
  day,
  month,
  year,
  onValueChange,
  ...props
}: BirthdateMonthProps) => {
  const t = useTranslations();

  return (
    <Select
      value={month}
      onValueChange={(value) => {
        onValueChange(value);

        const currentDay = day;
        if (!isDayAvailable(+currentDay, +month, +year)) {
          setValue('birthdateDay', '');
        }
      }}
      {...props}
    >
      <SelectTrigger data-test="birthdate-month">
        <SelectValue placeholder={t('signup-edit.month')} />
      </SelectTrigger>
      <SelectContent className="max-h-[400px]">
        {months.map((month, index) => (
          <SelectItem
            disabled={!isMonthAvailable(index, +year)}
            key={month}
            value={index.toString()}
          >
            {t(`signup-edit.months.${month}`)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
