import { getDaysInMonth } from 'date-fns';

export const isDayAvailable = (day: number, month: number, year: number): boolean => {
  const currentDate = new Date();

  if (currentDate.getFullYear() - year === 16) {
    if (+month > currentDate.getMonth()) {
      return false;
    }

    if (+month === currentDate.getMonth()) {
      return day <= +currentDate.getDate();
    }
  }

  const daysInMonth = getDaysInMonth(new Date(year, month));

  if (day > daysInMonth) {
    return false;
  }

  return true;
};

export const isMonthAvailable = (month: number, year: number): boolean => {
  const currentDate = new Date();

  if (currentDate.getFullYear() - year === 16) {
    return month <= +currentDate.getMonth();
  }

  return true;
};
